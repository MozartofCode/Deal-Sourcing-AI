import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { login, register } from '../services/api'
import { useAuth } from '../components/AuthContext'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuth()

  // Get the page the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let response
      if (isLogin) {
        response = await login(email, password)
      } else {
        if (!name.trim()) {
          setError('Name is required for registration')
          setLoading(false)
          return
        }
        response = await register(email, password, name)
      }

      setUser(response.user)
      // Redirect to the page they were trying to access, or home if none
      navigate(from, { replace: true })
    } catch (err) {
      // Enhanced error handling with clear, user-friendly messages
      let errorMsg = 'Authentication failed. Please try again.'
      
      // Check for specific error messages from backend
      if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.message) {
        // Handle network errors
        if (err.message.includes('Network Error') || err.message.includes('Failed to fetch')) {
          errorMsg = 'Unable to connect to the server. Please check your internet connection and try again.'
        } else {
          errorMsg = err.message
        }
      }
      
      // Handle HTTP status codes
      if (err.response?.status === 401) {
        errorMsg = errorMsg || 'Incorrect email or password. Please try again.'
      } else if (err.response?.status === 400) {
        errorMsg = errorMsg || 'Invalid information provided. Please check your details and try again.'
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again in a moment.'
      } else if (err.response?.status >= 500) {
        errorMsg = 'Server error. Please try again later.'
      }
      
      // Log full error for debugging (only in development)
      if (import.meta.env.DEV) {
        console.error(`${isLogin ? 'Login' : 'Registration'} error:`, {
          message: errorMsg,
          status: err.response?.status,
          data: err.response?.data,
          fullError: err
        })
      }
      
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg width="48" height="56" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left face - darker grey */}
                <path d="M12 2L2 12L6 16L12 10L18 16L22 12L12 2Z" fill="#374151"/>
                {/* Right face - lighter grey */}
                <path d="M12 2L22 12L18 16L12 10L6 16L2 12L12 2Z" fill="#6b7280"/>
                {/* Center highlight */}
                <path d="M12 4L18 10L12 16L6 10L12 4Z" fill="#9ca3af" opacity="0.6"/>
                {/* Base */}
                <rect x="8" y="16" width="8" height="10" fill="#374151"/>
                <rect x="9" y="16" width="6" height="10" fill="#6b7280"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'serif' }}>Scout</h1>
            <p className="text-gray-600">
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Your name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

