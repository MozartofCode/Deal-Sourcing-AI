import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import ChatInterface from '../components/ChatInterface'
import { getHistory } from '../services/api'

function Chat() {
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const history = await getHistory()
      setConversations(history)
      if (history.length > 0 && !currentConversationId) {
        setCurrentConversationId(history[0].id)
      }
    } catch (error) {
      console.error('Failed to load history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewConversation = () => {
    setCurrentConversationId(null)
  }

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
        onHistoryUpdate={loadHistory}
      />
      <ChatInterface
        conversationId={currentConversationId}
        onNewConversation={handleNewConversation}
        onHistoryUpdate={loadHistory}
      />
    </div>
  )
}

export default Chat

