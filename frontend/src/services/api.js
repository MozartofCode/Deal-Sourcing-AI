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

export const sendMessage = async (message, conversationId = null) => {
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

export const analyzeStartup = async (startupName, analysisType = 'comprehensive') => {
  const response = await api.post('/api/analyze', {
    startup_name: startupName,
    analysis_type: analysisType,
  })
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
export const register = async (email, password, name) => {
  const response = await api.post('/api/auth/register', {
    email,
    password,
    name,
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

export default api

