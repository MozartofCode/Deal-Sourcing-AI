import { useState, useEffect } from 'react'
import { generateAIMatches, getAIMatches, updateMatchStatus, sendMessage, createConnectionRequest } from '../services/api'
import { useAuth } from '../components/AuthContext'

function AIMatches() {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailDraft, setEmailDraft] = useState('')

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      setLoading(true)
      const data = await getAIMatches()
      setMatches(data)
    } catch (error) {
      console.error('Failed to load matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateMatches = async () => {
    try {
      setGenerating(true)
      await generateAIMatches()
      await loadMatches()
    } catch (error) {
      console.error('Failed to generate matches:', error)
      alert('Failed to generate matches. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleViewMatch = async (match) => {
    setSelectedMatch(match)
    setEmailDraft(match.suggested_email_draft || '')
    setShowEmailModal(true)
    
    // Mark as viewed
    if (match.status === 'pending') {
      try {
        await updateMatchStatus(match.id, 'viewed')
        await loadMatches()
      } catch (error) {
        console.error('Failed to update match status:', error)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!selectedMatch || !emailDraft.trim()) return

    try {
      // Extract subject and body from email draft
      const lines = emailDraft.split('\n')
      const subjectLine = lines.find(line => line.toLowerCase().startsWith('subject:'))
      const subject = subjectLine ? subjectLine.split(':')[1].trim() : 'Connection Request'
      const body = lines.filter(line => !line.toLowerCase().startsWith('subject:')).join('\n').trim()

      await sendMessage(selectedMatch.matched_item_id, body, subject)
      await updateMatchStatus(selectedMatch.id, 'contacted')
      setShowEmailModal(false)
      setSelectedMatch(null)
      await loadMatches()
      alert('Message sent successfully!')
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleDismiss = async (matchId) => {
    try {
      await updateMatchStatus(matchId, 'dismissed')
      await loadMatches()
    } catch (error) {
      console.error('Failed to dismiss match:', error)
    }
  }

  const pendingMatches = matches.filter(m => m.status === 'pending')
  const viewedMatches = matches.filter(m => m.status === 'viewed')
  const contactedMatches = matches.filter(m => m.status === 'contacted')

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI-Powered Matches</h1>
              <p className="text-gray-600">
                Discover {user?.user_type === 'entrepreneur' ? 'investors' : 'startups'} that match your profile
              </p>
            </div>
            <button
              onClick={handleGenerateMatches}
              disabled={generating}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {generating ? 'Generating...' : 'Generate New Matches'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            <p className="mt-4 text-gray-600">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">No matches yet</p>
            <p className="text-gray-400 text-sm mb-6">Click "Generate New Matches" to find potential connections</p>
            <button
              onClick={handleGenerateMatches}
              disabled={generating}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Matches'}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Matches */}
            {pendingMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">New Matches ({pendingMatches.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingMatches.map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{match.matched_item_name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {match.match_score}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{match.match_reason}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMatch(match)}
                          className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm"
                        >
                          View & Contact
                        </button>
                        <button
                          onClick={() => handleDismiss(match.id)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Viewed Matches */}
            {viewedMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Viewed ({viewedMatches.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {viewedMatches.map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{match.matched_item_name}</h3>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            {match.match_score}% Match
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{match.match_reason}</p>
                      <button
                        onClick={() => handleViewMatch(match)}
                        className="w-full px-4 py-2 border border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacted Matches */}
            {contactedMatches.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contacted ({contactedMatches.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contactedMatches.map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-sm border border-green-200 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{match.matched_item_name}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Contacted
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm">{match.match_reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && selectedMatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Contact {selectedMatch.matched_item_name}</h2>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2"><strong>Why this match:</strong></p>
                  <p className="text-sm text-gray-600">{selectedMatch.match_reason}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Draft (AI-generated, you can edit)
                  </label>
                  <textarea
                    value={emailDraft}
                    onChange={(e) => setEmailDraft(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none font-mono text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSendMessage}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIMatches

