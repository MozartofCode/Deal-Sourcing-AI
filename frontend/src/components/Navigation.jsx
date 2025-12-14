import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { logout } from '../services/api'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left face - darker blue */}
                <path d="M12 2L2 12L6 16L12 10L18 16L22 12L12 2Z" fill="#1e3a8a"/>
                {/* Right face - lighter blue */}
                <path d="M12 2L22 12L18 16L12 10L6 16L2 12L12 2Z" fill="#3b82f6"/>
                {/* Center highlight */}
                <path d="M12 4L18 10L12 16L6 10L12 4Z" fill="#60a5fa" opacity="0.6"/>
                {/* Base */}
                <rect x="8" y="16" width="8" height="10" fill="#1e3a8a"/>
                <rect x="9" y="16" width="6" height="10" fill="#3b82f6"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Scout</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/discover"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/discover')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Discover Startups
            </Link>
            <Link
              to="/portfolio"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/portfolio')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              My Portfolio
            </Link>
            <Link
              to="/analysis"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/analysis')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Startup Analysis
            </Link>
            <Link
              to="/search"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/search')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              Search
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">{user.name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu')
                menu?.classList.toggle('hidden')
              }}
              className="p-2 rounded-lg text-gray-700 hover:bg-blue-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" className="hidden md:hidden border-t border-blue-100">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/discover"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/discover')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Discover Startups
          </Link>
          <Link
            to="/portfolio"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/portfolio')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            My Portfolio
          </Link>
          <Link
            to="/analysis"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/analysis')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Startup Analysis
          </Link>
          <Link
            to="/search"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${
              isActive('/search')
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            Search
          </Link>
            {user ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-700 border-t border-blue-100 mt-2 pt-2">
                  {user.name || user.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 text-center mt-2"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    )
  }
  
  export default Navigation

