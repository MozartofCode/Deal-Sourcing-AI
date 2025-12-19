import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login if needed
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // You might want to redirect to login page here
    }
    return Promise.reject(error)
  }
)

export const sendChatMessage = async (message, conversationId = null) => {
  const response = await api.post('/api/chat', {
    message,
    conversation_id: conversationId,
  })
  return response.data
}

export const getHistory = async () => {
  const response = await api.get('/api/history')
  return response.data
}

export const createConversation = async (title) => {
  const response = await api.post('/api/history', {
    title,
  })
  return response.data
}

export const healthCheck = async () => {
  const response = await api.get('/health')
  return response.data
}

export const discoverStartups = async (query, industry = null, stage = null) => {
  const response = await api.post('/api/discover', {
    query,
    industry: industry === 'all' ? null : industry,
    stage: stage === 'all' ? null : stage,
  })
  return response.data
}

export const analyzeStartup = async (startupName, analysisTypes = ['comprehensive'], customQuery = undefined, portfolioStartup = undefined) => {
  const payload = {
    startup_name: startupName,
    analysis_types: Array.isArray(analysisTypes) ? analysisTypes : [analysisTypes],
  }
  
  if (customQuery) {
    payload.custom_query = customQuery
  }
  
  if (portfolioStartup) {
    payload.portfolio_startup = {
      id: portfolioStartup.id,
      startup_name: portfolioStartup.startup_name,
      industry: portfolioStartup.industry,
      stage: portfolioStartup.stage,
      notes: portfolioStartup.notes,
    }
  }
  
  const response = await api.post('/api/analyze', payload)
  return response.data
}

export const search = async (query, searchType = 'all') => {
  const response = await api.post('/api/search', {
    query,
    search_type: searchType,
  })
  return response.data
}

// Authentication APIs
export const register = async (email, password, name, userType) => {
  const response = await api.post('/api/auth/register', {
    email,
    password,
    name,
    user_type: userType,
  })
  // Store token and user
  if (response.data.access_token) {
    localStorage.setItem('auth_token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', {
    email,
    password,
  })
  // Store token and user
  if (response.data.access_token) {
    localStorage.setItem('auth_token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return response.data
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token')
}

export const getAuthToken = () => {
  return localStorage.getItem('auth_token')
}

export const getUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Portfolio APIs
export const getPortfolio = async () => {
  const response = await api.get('/api/portfolio')
  return response.data
}

export const addToPortfolio = async (portfolioData) => {
  const response = await api.post('/api/portfolio', portfolioData)
  return response.data
}

export const updatePortfolioItem = async (portfolioId, portfolioData) => {
  const response = await api.put(`/api/portfolio/${portfolioId}`, portfolioData)
  return response.data
}

export const deletePortfolioItem = async (portfolioId) => {
  const response = await api.delete(`/api/portfolio/${portfolioId}`)
  return response.data
}

export const getPortfolioStats = async () => {
  const response = await api.get('/api/portfolio/stats/summary')
  return response.data
}

// Tracking APIs
export const saveSearchHistory = async (searchType, query, filters = null, resultsCount = null) => {
  const response = await api.post('/api/tracking/search-history', {
    search_type: searchType,
    query,
    filters,
    results_count: resultsCount,
  })
  return response.data
}

export const trackProfileView = async (viewedType, viewedId, viewedName = null, metadata = null) => {
  const response = await api.post('/api/tracking/profile-view', {
    viewed_type: viewedType,
    viewed_id: viewedId,
    viewed_name: viewedName,
    metadata,
  })
  return response.data
}

export const saveItem = async (itemType, itemId, itemName, itemData = null, notes = null, tags = null) => {
  const response = await api.post('/api/tracking/saved-items', {
    item_type: itemType,
    item_id: itemId,
    item_name: itemName,
    item_data: itemData,
    notes,
    tags,
  })
  return response.data
}

export const getSavedItems = async (itemType = null) => {
  const params = itemType ? { item_type: itemType } : {}
  const response = await api.get('/api/tracking/saved-items', { params })
  return response.data
}

export const deleteSavedItem = async (itemId, itemType) => {
  const response = await api.delete(`/api/tracking/saved-items/${itemId}?item_type=${itemType}`)
  return response.data
}

// Profile APIs
export const getMyProfile = async () => {
  const response = await api.get('/api/profiles/me')
  return response.data
}

export const updateMyProfile = async (profileData) => {
  const response = await api.put('/api/profiles/me', profileData)
  return response.data
}

export const getUserProfile = async (userId) => {
  const response = await api.get(`/api/profiles/${userId}`)
  return response.data
}

export const searchProfiles = async (userType = null, industry = null) => {
  const params = {}
  if (userType) params.user_type = userType
  if (industry) params.industry = industry
  const response = await api.get('/api/profiles/', { params })
  return response.data
}

// Direct Messaging APIs (between users)
export const sendDirectMessage = async (recipientId, message, subject = null, relatedItemType = null, relatedItemId = null) => {
  const response = await api.post('/api/messaging/messages', {
    recipient_id: recipientId,
    message,
    subject,
    related_item_type: relatedItemType,
    related_item_id: relatedItemId,
  })
  return response.data
}

export const getMessages = async (conversationWith = null) => {
  const params = conversationWith ? { conversation_with: conversationWith } : {}
  const response = await api.get('/api/messaging/messages', { params })
  return response.data
}

export const getConversations = async () => {
  const response = await api.get('/api/messaging/messages/conversations')
  return response.data
}

export const markMessageRead = async (messageId) => {
  const response = await api.put(`/api/messaging/messages/${messageId}/read`)
  return response.data
}

export const createConnectionRequest = async (recipientId, message = null) => {
  const response = await api.post('/api/messaging/connection-requests', {
    recipient_id: recipientId,
    message,
  })
  return response.data
}

export const getConnectionRequests = async (status = null) => {
  const params = status ? { status } : {}
  const response = await api.get('/api/messaging/connection-requests', { params })
  return response.data
}

export const updateConnectionRequest = async (requestId, status) => {
  const response = await api.put(`/api/messaging/connection-requests/${requestId}?status=${status}`)
  return response.data
}

// AI Matching APIs
export const generateAIMatches = async () => {
  const response = await api.post('/api/ai/generate-matches')
  return response.data
}

export const getAIMatches = async (status = null) => {
  const params = status ? { status } : {}
  const response = await api.get('/api/ai/matches', { params })
  return response.data
}

export const updateMatchStatus = async (matchId, status) => {
  const response = await api.put(`/api/ai/matches/${matchId}?status=${status}`)
  return response.data
}

export default api

