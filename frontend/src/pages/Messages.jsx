import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getConversations, getMessages, sendDirectMessage, markMessageRead, searchProfiles, getAIMatches } from '../services/api'
import { useAuth } from '../components/AuthContext'
import MessageModal from '../components/MessageModal'

function Messages() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [recommendedUsers, setRecommendedUsers] = useState([])
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [activeTab, setActiveTab] = useState('conversations') // 'conversations', 'recommended', 'all-users'

  useEffect(() => {
    loadConversations()
    loadRecommendedUsers()
    loadAllUsers()
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.user_id)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await getConversations()
      
      // Enrich conversations with user profile data
      const enrichedConversations = await Promise.all(
        data.map(async (conv) => {
          try {
            const profiles = await searchProfiles(null, null)
            const userProfile = profiles.find(p => p.user_id === conv.user_id)
            return {
              ...conv,
              user_name: userProfile?.company_name || userProfile?.user_id || `User ${conv.user_id.slice(0, 8)}`,
              user_profile: userProfile
            }
          } catch (error) {
            return {
              ...conv,
              user_name: `User ${conv.user_id.slice(0, 8)}`
            }
          }
        })
      )
      
      setConversations(enrichedConversations)
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (userId) => {
    try {
      const data = await getMessages(userId)
      setMessages(data)
      
      // Mark unread messages as read
      const unreadMessages = data.filter(msg => !msg.is_read && msg.recipient_id === user?.id)
      for (const msg of unreadMessages) {
        try {
          await markMessageRead(msg.id)
        } catch (error) {
          console.error('Failed to mark message as read:', error)
        }
      }
      
      // Reload conversations to update unread counts
      await loadConversations()
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const loadRecommendedUsers = async () => {
    try {
      const matches = await getAIMatches('pending')
      // Get unique user IDs from matches
      const userIds = [...new Set(matches.map(m => m.matched_item_id))]
      
      // Fetch all profiles first
      const allProfiles = await searchProfiles(null, null)
      
      // Match profiles with AI matches
      const profiles = []
      for (const userId of userIds.slice(0, 10)) {
        const userProfile = allProfiles.find(p => p.user_id === userId)
        if (userProfile) {
          const match = matches.find(m => m.matched_item_id === userId)
          profiles.push({ 
            ...userProfile, 
            match_score: match?.match_score, 
            match_reason: match?.match_reason 
          })
        }
      }
      setRecommendedUsers(profiles)
    } catch (error) {
      console.error('Failed to load recommended users:', error)
    }
  }

  const loadAllUsers = async () => {
    try {
      setLoadingUsers(true)
      // Get opposite user type
      const oppositeType = user?.user_type === 'entrepreneur' ? 'investor' : 'entrepreneur'
      const profiles = await searchProfiles(oppositeType, null)
      setAllUsers(profiles)
    } catch (error) {
      console.error('Failed to load all users:', error)
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleMessageUser = async (userProfile) => {
    // Check if conversation already exists
    const existingConv = conversations.find(c => c.user_id === userProfile.user_id)
    
    if (existingConv) {
      // Switch to conversations tab and select this conversation
      setActiveTab('conversations')
      setSelectedConversation(existingConv)
      await loadMessages(userProfile.user_id)
    } else {
      // Open message modal to start new conversation
      setSelectedRecipient({
        user_id: userProfile.user_id,
        name: userProfile.company_name || userProfile.user_id
      })
      setShowNewMessageModal(true)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      setSending(true)
      await sendDirectMessage(selectedConversation.user_id, newMessage.trim())
      setNewMessage('')
      await loadMessages(selectedConversation.user_id)
      await loadConversations()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const filteredUsers = allUsers.filter(user => {
    if (!userSearchQuery.trim()) return true
    const query = userSearchQuery.toLowerCase()
    return (
      user.company_name?.toLowerCase().includes(query) ||
      user.bio?.toLowerCase().includes(query) ||
      user.industry?.toLowerCase().includes(query) ||
      user.location?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-gray-600">Connect and communicate with other users</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('all-users')
                setSelectedConversation(null)
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              + New Message
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Left Sidebar - Conversations/Users */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('conversations')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'conversations'
                      ? 'bg-gray-100 text-gray-900 border-b-2 border-gray-800'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Conversations
                </button>
                <button
                  onClick={() => setActiveTab('recommended')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'recommended'
                      ? 'bg-gray-100 text-gray-900 border-b-2 border-gray-800'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Recommended
                </button>
                <button
                  onClick={() => setActiveTab('all-users')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'all-users'
                      ? 'bg-gray-100 text-gray-900 border-b-2 border-gray-800'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Users
                </button>
              </div>

              {/* Content based on active tab */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'conversations' && (
                  <>
                    {conversations.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No conversations yet</p>
                        <p className="text-sm mt-2">Start connecting with other users!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {conversations.map((conv) => (
                          <button
                            key={conv.user_id}
                            onClick={() => {
                              setSelectedConversation(conv)
                              setActiveTab('conversations')
                            }}
                            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                              selectedConversation?.user_id === conv.user_id ? 'bg-gray-50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {conv.user_name || `User ${conv.user_id.slice(0, 8)}`}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(conv.last_message_at).toLocaleDateString()}
                                </p>
                              </div>
                              {conv.unread_count > 0 && (
                                <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                  {conv.unread_count}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {activeTab === 'recommended' && (
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      AI-recommended {user?.user_type === 'entrepreneur' ? 'investors' : 'entrepreneurs'} based on your profile
                    </p>
                    {recommendedUsers.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">No recommendations yet</p>
                        <p className="text-xs mt-2">Generate matches in AI Matches to see recommendations here</p>
                        <button
                          onClick={() => navigate('/ai-matches')}
                          className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900"
                        >
                          Go to AI Matches
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recommendedUsers.map((userProfile) => (
                          <div
                            key={userProfile.user_id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => handleMessageUser(userProfile)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {userProfile.company_name || 'User'}
                                </h3>
                                {userProfile.match_score && (
                                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                    {userProfile.match_score}% Match
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMessageUser(userProfile)
                                }}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Message
                              </button>
                            </div>
                            {userProfile.bio && (
                              <p className="text-xs text-gray-600 line-clamp-2 mt-2">{userProfile.bio}</p>
                            )}
                            {userProfile.match_reason && (
                              <p className="text-xs text-gray-500 mt-2 italic">"{userProfile.match_reason}"</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              {userProfile.industry && <span>{userProfile.industry}</span>}
                              {userProfile.location && <span>• {userProfile.location}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'all-users' && (
                  <div className="p-4">
                    <div className="mb-4">
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder={`Search ${user?.user_type === 'entrepreneur' ? 'investors' : 'entrepreneurs'}...`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                      />
                    </div>
                    {loadingUsers ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading users...</p>
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p className="text-sm">No users found</p>
                        <p className="text-xs mt-2">Try adjusting your search</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredUsers.map((userProfile) => (
                          <div
                            key={userProfile.user_id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-sm font-semibold text-gray-900">
                                  {userProfile.company_name || 'User'}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                  {userProfile.industry && <span>{userProfile.industry}</span>}
                                  {userProfile.location && <span>• {userProfile.location}</span>}
                                </div>
                              </div>
                              <button
                                onClick={() => handleMessageUser(userProfile)}
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                Message
                              </button>
                            </div>
                            {userProfile.bio && (
                              <p className="text-xs text-gray-600 line-clamp-2 mt-2">{userProfile.bio}</p>
                            )}
                            {userProfile.user_type === 'investor' && userProfile.investment_focus && (
                              <p className="text-xs text-gray-500 mt-2">
                                <strong>Focus:</strong> {userProfile.investment_focus}
                              </p>
                            )}
                            {userProfile.user_type === 'entrepreneur' && userProfile.startup_stage && (
                              <p className="text-xs text-gray-500 mt-2">
                                <strong>Stage:</strong> {userProfile.startup_stage}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Conversation with {selectedConversation.user_name || `User ${selectedConversation.user_id.slice(0, 8)}`}
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.sender_id === user?.id
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isOwn
                                  ? 'bg-gray-800 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              {msg.subject && (
                                <p className={`text-sm font-medium mb-1 ${isOwn ? 'text-gray-300' : 'text-gray-700'}`}>
                                  {msg.subject}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(msg.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Type your message..."
                        rows={3}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mb-2">Select a conversation or user to start messaging</p>
                    <p className="text-sm text-gray-400">Browse Recommended or All Users to find someone to message</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {selectedRecipient && (
          <MessageModal
            isOpen={showNewMessageModal}
            onClose={() => {
              setShowNewMessageModal(false)
              setSelectedRecipient(null)
            }}
            recipientId={selectedRecipient.user_id}
            recipientName={selectedRecipient.name}
            subject={`Connection Request`}
          />
        )}
      </div>
    </div>
  )
}

export default Messages

