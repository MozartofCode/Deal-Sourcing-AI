import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendDirectMessage } from '../services/api'

function MessageModal({ isOpen, onClose, recipientId, recipientName, subject = null }) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Please enter a message')
      return
    }

    if (!recipientId) {
      alert('Recipient not found. Please make sure the user has a profile.')
      return
    }

    try {
      setSending(true)
      await sendDirectMessage(recipientId, message.trim(), subject)
      setMessage('')
      onClose()
      // Navigate to messages page to see the conversation
      navigate('/messages')
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMsg = error.response?.data?.detail || error.message || 'Failed to send message'
      alert(errorMsg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Message {recipientName || 'User'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {subject && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
          )}

          {!recipientId && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This user doesn't have a profile yet. To message them, they need to create a profile first. 
                You can find users with profiles in the AI Matches section or by searching profiles.
              </p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
              placeholder="Type your message here..."
              disabled={!recipientId}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending || !recipientId}
              className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageModal

