import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export default api

