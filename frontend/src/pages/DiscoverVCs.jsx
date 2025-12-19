import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { discoverStartups, saveSearchHistory, trackProfileView, saveItem, getSavedItems, searchProfiles } from '../services/api'
import MessageModal from '../components/MessageModal'

function DiscoverVCs() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState(null)
  const [savedItems, setSavedItems] = useState([])
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [selectedVC, setSelectedVC] = useState(null)
  const [vcProfiles, setVcProfiles] = useState({}) // Map VC names to user IDs
  const navigate = useNavigate()

  useEffect(() => {
    loadSavedItems()
  }, [])

  const loadSavedItems = async () => {
    try {
      const saved = await getSavedItems('vc')
      setSavedItems(saved.map(item => item.item_id))
    } catch (error) {
      console.error('Failed to load saved items:', error)
    }
  }

  const industries = [
    'All Industries',
    'Fintech',
    'Healthcare',
    'SaaS',
    'E-commerce',
    'AI/ML',
    'Biotech',
    'EdTech',
    'CleanTech',
    'Cybersecurity',
  ]

  const stages = ['All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+']

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    try {
      // For now, using the same API but with different context
      const result = await discoverStartups(`VCs and investors interested in: ${searchQuery}`, selectedIndustry, selectedStage)
      setSearchResults(result.results)
      
      // Auto-save search
      try {
        await saveSearchHistory('vc', searchQuery, {
          industry: selectedIndustry,
          stage: selectedStage
        }, result.results ? 1 : 0)
      } catch (err) {
        console.error('Failed to save search:', err)
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to search VCs')
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveItem = async (vc) => {
    try {
      await saveItem('vc', vc.id.toString(), vc.name, vc)
      alert('VC saved!')
      // Reload saved items
      const saved = await getSavedItems('vc')
      setSavedItems(saved.map(item => item.item_id))
    } catch (error) {
      console.error('Failed to save:', error)
      alert('Failed to save VC')
    }
  }

  const handleViewVC = async (vc) => {
    try {
      await trackProfileView('vc', vc.id.toString(), vc.name, vc)
    } catch (error) {
      console.error('Failed to track view:', error)
    }
  }

  const handleMessageVC = async (vc) => {
    // Try to find the VC's user profile
    try {
      const profiles = await searchProfiles('investor', vc.focus?.split(',')[0] || null)
      const matchingProfile = profiles.find(p => 
        p.company_name?.toLowerCase().includes(vc.name.toLowerCase()) ||
        vc.name.toLowerCase().includes(p.company_name?.toLowerCase() || '')
      )
      
      if (matchingProfile) {
        setSelectedVC({ ...vc, userId: matchingProfile.user_id, userName: matchingProfile.company_name })
        setShowMessageModal(true)
      } else {
        // If no profile found, show message modal anyway (user can still send)
        setSelectedVC({ ...vc, userId: null, userName: vc.name })
        setShowMessageModal(true)
      }
    } catch (error) {
      console.error('Failed to find VC profile:', error)
      // Show modal anyway
      setSelectedVC({ ...vc, userId: null, userName: vc.name })
      setShowMessageModal(true)
    }
  }

  // Mock data - VCs and investors
  const mockVCs = [
    {
      id: 1,
      name: 'TechVentures Capital',
      focus: 'SaaS, AI/ML',
      stage: 'Seed, Series A',
      description: 'Early-stage VC focused on B2B SaaS and AI startups',
      location: 'San Francisco, CA',
      portfolioSize: '50+',
      avgCheckSize: '$500K - $2M',
    },
    {
      id: 2,
      name: 'HealthInnovate Partners',
      focus: 'Healthcare, Biotech',
      stage: 'Seed, Series A, Series B',
      description: 'Leading healthcare and biotech investment firm',
      location: 'Boston, MA',
      portfolioSize: '30+',
      avgCheckSize: '$1M - $5M',
    },
    {
      id: 3,
      name: 'GreenFuture Ventures',
      focus: 'CleanTech, Sustainability',
      stage: 'Pre-Seed, Seed',
      description: 'Dedicated to funding sustainable technology solutions',
      location: 'Austin, TX',
      portfolioSize: '25+',
      avgCheckSize: '$250K - $1M',
    },
    {
      id: 4,
      name: 'FinTech Growth Fund',
      focus: 'Fintech',
      stage: 'Series A, Series B',
      description: 'Growth-stage fintech investment specialist',
      location: 'New York, NY',
      portfolioSize: '40+',
      avgCheckSize: '$2M - $10M',
    },
    {
      id: 5,
      name: 'EdTech Ventures',
      focus: 'EdTech',
      stage: 'Seed, Series A',
      description: 'Supporting innovative education technology companies',
      location: 'Seattle, WA',
      portfolioSize: '20+',
      avgCheckSize: '$500K - $3M',
    },
    {
      id: 6,
      name: 'CyberSecure Capital',
      focus: 'Cybersecurity',
      stage: 'Seed, Series A, Series B',
      description: 'Cybersecurity-focused investment firm',
      location: 'Washington, DC',
      portfolioSize: '35+',
      avgCheckSize: '$1M - $5M',
    },
  ]

  const filteredVCs = mockVCs.filter((vc) => {
    const matchesSearch =
      vc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vc.focus.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry =
      selectedIndustry === 'all' || vc.focus.toLowerCase().includes(selectedIndustry.toLowerCase())
    const matchesStage =
      selectedStage === 'all' || vc.stage.toLowerCase().includes(selectedStage.toLowerCase())
    return matchesSearch && matchesIndustry && matchesStage
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover VCs & Investors</h1>
          <p className="text-gray-600">
            Find the right investors and venture capital firms for your startup
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search VCs & Investors
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, focus area, or keywords..."
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                />
                <svg
                  className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
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
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Focus
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {industries.map((industry) => (
                    <option
                      key={industry}
                      value={industry === 'All Industries' ? 'all' : industry}
                    >
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {stages.map((stage) => (
                    <option
                      key={stage}
                      value={stage === 'All Stages' ? 'all' : stage}
                    >
                      {stage}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSearching ? 'Searching...' : 'Search with AI'}
            </button>
          </div>
        </div>

        {/* AI Search Results */}
        {searchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Search Results</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{searchResults}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {!searchResults && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Sample VCs and investors (use search above for AI-powered results)
              </p>
            </div>

            {/* VC Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVCs.map((vc) => (
                <div
                  key={vc.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {vc.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {vc.location}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm">{vc.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Focus:</span>
                      <span className="font-medium text-gray-900">{vc.focus}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Stages:</span>
                      <span className="font-medium text-gray-900">{vc.stage}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Portfolio:</span>
                      <span className="font-medium text-gray-900">{vc.portfolioSize} companies</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Check Size:</span>
                      <span className="font-medium text-gray-900">{vc.avgCheckSize}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewVC(vc)}
                      className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => handleMessageVC(vc)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      title="Message this VC"
                    >
                      💬 Message
                    </button>
                    <button 
                      onClick={() => handleSaveItem(vc)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        savedItems.includes(vc.id.toString())
                          ? 'bg-gray-800 text-white border-gray-800'
                          : 'border-gray-800 text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {savedItems.includes(vc.id.toString()) ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!searchResults && filteredVCs.length === 0 && (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No VCs found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {selectedVC && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => {
            setShowMessageModal(false)
            setSelectedVC(null)
          }}
          recipientId={selectedVC.userId}
          recipientName={selectedVC.userName || selectedVC.name}
          subject={selectedVC.userId ? `Interest in ${selectedVC.name}` : null}
        />
      )}
    </div>
  )
}

export default DiscoverVCs

