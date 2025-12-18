import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getPortfolio,
  addToPortfolio,
  updatePortfolioItem,
  deletePortfolioItem,
  getPortfolioStats,
  isAuthenticated,
} from '../services/api'
import { useAuth } from '../components/AuthContext'

function Portfolio() {
  const [savedStartups, setSavedStartups] = useState([])
  const [stats, setStats] = useState({ total: 0, active: 0, reviewing: 0, invested: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStartup, setNewStartup] = useState({
    startup_name: '',
    industry: '',
    stage: '',
    notes: '',
    status: 'Active',
  })
  const navigate = useNavigate()
  const { isAuthenticated: authStatus } = useAuth()

  useEffect(() => {
    if (!authStatus) {
      navigate('/login')
      return
    }
    loadPortfolio()
  }, [authStatus, navigate])

  const loadPortfolio = async () => {
    try {
      setLoading(true)
      const [portfolioData, statsData] = await Promise.all([
        getPortfolio(),
        getPortfolioStats(),
      ])
      setSavedStartups(portfolioData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load portfolio:', error)
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddStartup = async () => {
    try {
      await addToPortfolio(newStartup)
      setShowAddModal(false)
      setNewStartup({
        startup_name: '',
        industry: '',
        stage: '',
        notes: '',
        status: 'Active',
      })
      loadPortfolio()
    } catch (error) {
      console.error('Failed to add startup:', error)
      alert('Failed to add startup. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this startup from your portfolio?')) {
      return
    }
    try {
      await deletePortfolioItem(id)
      loadPortfolio()
    } catch (error) {
      console.error('Failed to delete startup:', error)
      alert('Failed to delete startup. Please try again.')
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updatePortfolioItem(id, { status: newStatus })
      loadPortfolio()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Portfolio</h1>
            <p className="text-gray-600">
              Manage and track startups you're interested in
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-md"
          >
            + Add Startup
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600">Total Startups</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stats.active}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {stats.reviewing}
              </div>
              <div className="text-sm text-gray-600">Under Review</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.invested}
              </div>
              <div className="text-sm text-gray-600">Invested</div>
            </div>
          </div>
        )}

        {/* Portfolio Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Startup
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Added
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {savedStartups.map((startup) => (
                  <tr key={startup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {startup.startup_name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {startup.notes || 'No notes'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {startup.industry && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          {startup.industry}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startup.stage || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={startup.status}
                        onChange={(e) => handleStatusChange(startup.id, e.target.value)}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 ${
                          startup.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : startup.status === 'Reviewing'
                            ? 'bg-yellow-100 text-yellow-700'
                            : startup.status === 'Invested'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="Active">Active</option>
                        <option value="Reviewing">Reviewing</option>
                        <option value="Invested">Invested</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(startup.added_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(startup.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && savedStartups.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
              <p className="text-gray-500 text-lg mb-2">Your portfolio is empty</p>
              <p className="text-gray-400 text-sm mb-4">
                Start adding startups to track your investments
              </p>
              <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                Add Your First Startup
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Data</h3>
            <p className="text-gray-600 text-sm mb-4">
              Download your portfolio as CSV or PDF
            </p>
            <button className="w-full px-4 py-2 border border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Report</h3>
            <p className="text-gray-600 text-sm mb-4">
              Create a comprehensive analysis report
            </p>
            <button className="w-full px-4 py-2 border border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Generate
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Portfolio</h3>
            <p className="text-gray-600 text-sm mb-4">
              Share your portfolio with team members
            </p>
            <button className="w-full px-4 py-2 border border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Add Startup Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Startup to Portfolio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Startup Name *
                </label>
                <input
                  type="text"
                  value={newStartup.startup_name}
                  onChange={(e) => setNewStartup({ ...newStartup, startup_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="Enter startup name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <input
                  type="text"
                  value={newStartup.industry}
                  onChange={(e) => setNewStartup({ ...newStartup, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="e.g., SaaS, Fintech"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <input
                  type="text"
                  value={newStartup.stage}
                  onChange={(e) => setNewStartup({ ...newStartup, stage: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  placeholder="e.g., Seed, Series A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newStartup.notes}
                  onChange={(e) => setNewStartup({ ...newStartup, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500"
                  rows="3"
                  placeholder="Add your notes about this startup..."
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddStartup}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900"
              >
                Add Startup
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio

