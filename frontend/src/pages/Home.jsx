import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthContext'

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const handleProtectedClick = (path) => {
    if (isAuthenticated) {
      navigate(path)
    } else {
      navigate('/login', { state: { from: { pathname: path } } })
    }
  }

  const isLoggedOut = !isAuthenticated

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-gray-800" style={{ fontFamily: 'serif' }}>Scout</span>
          </h1>
          {isLoggedOut ? (
            <>
              <p className="text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
                The Platform Where Entrepreneurs Meet Investors
              </p>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Whether you're raising funds or looking to invest, Scout connects the next generation of entrepreneurs with forward-thinking investors.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link
                  to="/login"
                  className="px-8 py-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md text-lg"
                >
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                {user?.user_type === 'entrepreneur' 
                  ? 'Your intelligent platform for finding investors and raising funds. Connect with VCs and get AI-powered fundraising insights.'
                  : 'Your intelligent platform for startup discovery, analysis, and portfolio management. Make data-driven investment decisions with AI-powered insights.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user?.user_type === 'entrepreneur' ? (
                  <>
                    <button
                      onClick={() => handleProtectedClick('/discover-vcs')}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md"
                    >
                      Discover VCs
                    </button>
                    <button
                      onClick={() => handleProtectedClick('/fundraising')}
                      className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Fundraising Tools
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleProtectedClick('/discover')}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md"
                    >
                      Discover Startups
                    </button>
                    <button
                      onClick={() => handleProtectedClick('/analysis')}
                      className="px-6 py-3 bg-white text-gray-800 border-2 border-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Analyze Startup
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Two-Sided Platform Section - Only show when logged out */}
        {isLoggedOut && (
          <div className="mt-20 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">One Platform, Two Perspectives</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Scout is designed for both sides of the deal. Choose your path and unlock powerful tools tailored to your needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Entrepreneur Side */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Entrepreneurs</h3>
                    <p className="text-blue-700 font-medium">Raising Funds?</p>
                  </div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Discover VCs and investors matched to your industry and stage</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">AI-powered pitch deck analysis and fundraising insights</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Get personalized recommendations for your fundraising journey</span>
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Sign Up as Entrepreneur →
                </Link>
              </div>

              {/* Investor Side */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">For Investors</h3>
                    <p className="text-green-700 font-medium">Looking to Invest?</p>
                  </div>
                </div>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Discover promising startups across industries and stages</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Deep startup analysis: IP, financials, team, and market position</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Build and manage your investment portfolio with AI insights</span>
                  </li>
                </ul>
                <Link
                  to="/login"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-md"
                >
                  Sign Up as Investor →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isLoggedOut ? 'mt-20' : 'mt-20'}`}>
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.user_type === 'entrepreneur' ? 'Discover VCs' : 'Discover Startups'}
            </h3>
            <p className="text-gray-600">
              {user?.user_type === 'entrepreneur'
                ? 'Find the right investors and venture capital firms for your startup. Search by industry, stage, and investment focus.'
                : 'Find promising startups across industries. Search by sector, stage, location, and more.'}
            </p>
            <button
              onClick={() => handleProtectedClick(user?.user_type === 'entrepreneur' ? '/discover-vcs' : '/discover')}
              className="mt-4 inline-block text-gray-700 font-medium hover:text-gray-900"
            >
              Explore →
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.user_type === 'entrepreneur' ? 'Fundraising Tools' : 'Startup Analysis'}
            </h3>
            <p className="text-gray-600">
              {user?.user_type === 'entrepreneur'
                ? 'Get AI-powered insights to improve your pitch deck and fundraising strategy.'
                : 'Deep dive into IP portfolios, financial metrics, and founding team backgrounds.'}
            </p>
            <button
              onClick={() => handleProtectedClick(user?.user_type === 'entrepreneur' ? '/fundraising' : '/analysis')}
              className="mt-4 inline-block text-gray-700 font-medium hover:text-gray-900"
            >
              {user?.user_type === 'entrepreneur' ? 'Get Started →' : 'Analyze →'}
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Portfolio</h3>
            <p className="text-gray-600">
              Organize and track startups you're interested in. Save notes, documents, and insights.
            </p>
            <button
              onClick={() => handleProtectedClick('/portfolio')}
              className="mt-4 inline-block text-gray-700 font-medium hover:text-gray-900"
            >
              View Portfolio →
            </button>
          </div>


          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h3>
            <p className="text-gray-600">
              Your portfolio data and research are securely stored and accessible anytime.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">10K+</div>
              <div className="text-gray-600">Startups in Database</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">50+</div>
              <div className="text-gray-600">Industries Covered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-800 mb-2">24/7</div>
              <div className="text-gray-600">AI-Powered Insights</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

