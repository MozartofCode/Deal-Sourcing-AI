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
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Blue arrow pointing up-right */}
                <path d="M30 70 L30 50 L50 50 L50 30 L70 30 L70 50 L90 50 L70 70 L70 90 L50 70 Z" fill="url(#blueGradient)" />
                <defs>
                  <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: 'serif' }}>Scout</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                ? 'bg-gray-100 text-gray-800'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                }`}
            >
              Home
            </Link>
            {user?.user_type === 'entrepreneur' ? (
              <>
                <Link
                  to="/discover-vcs"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/discover-vcs')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Discover VCs
                </Link>
                <Link
                  to="/fundraising"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/fundraising')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Fundraising
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/discover"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/discover')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Discover Startups
                </Link>
                <Link
                  to="/portfolio"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/portfolio')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  My Portfolio
                </Link>
                <Link
                  to="/analysis"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/analysis')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Startup Analysis
                </Link>
                <Link
                  to="/ai-matches"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/ai-matches')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  AI Matches
                </Link>
                <Link
                  to="/email-workflow"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/email-workflow')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Email Flow
                </Link>
                <Link
                  to="/thesis"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/thesis')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Thesis
                </Link>
                <Link
                  to="/network-intros"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/network-intros')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Network
                </Link>
                <Link
                  to="/messages"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/messages')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Messages
                </Link>
                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/profile')
                    ? 'bg-gray-100 text-gray-800'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  Profile
                </Link>
              </>
            )}
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
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
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
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
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
      <div id="mobile-menu" className="hidden md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/')
              ? 'bg-gray-100 text-gray-800'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
              }`}
          >
            Home
          </Link>
          {user?.user_type === 'entrepreneur' ? (
            <>
              <Link
                to="/discover-vcs"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/discover-vcs')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Discover VCs
              </Link>
              <Link
                to="/fundraising"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/fundraising')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Fundraising
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/discover"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/discover')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Discover Startups
              </Link>
              <Link
                to="/portfolio"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/portfolio')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                My Portfolio
              </Link>
              <Link
                to="/analysis"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/analysis')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Startup Analysis
              </Link>
              <Link
                to="/ai-matches"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/ai-matches')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                AI Matches
              </Link>
              <Link
                to="/messages"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/messages')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Messages
              </Link>
              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-lg text-base font-medium ${isActive('/profile')
                  ? 'bg-gray-100 text-gray-800'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'
                  }`}
              >
                Profile
              </Link>
            </>
          )}
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-gray-700 border-t border-gray-200 mt-2 pt-2">
                {user.name || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 bg-gray-800 text-white rounded-lg text-base font-medium hover:bg-gray-900 text-center mt-2"
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

