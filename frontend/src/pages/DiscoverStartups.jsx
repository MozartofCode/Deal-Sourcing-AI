import { useState } from 'react'
import { discoverStartups } from '../services/api'

function DiscoverStartups() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('all')
  const [selectedStage, setSelectedStage] = useState('all')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState(null)

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
      const result = await discoverStartups(searchQuery, selectedIndustry, selectedStage)
      setSearchResults(result.results)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to search startups')
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  // Mock data - fallback for display
  const mockStartups = [
    {
      id: 1,
      name: 'TechFlow Solutions',
      industry: 'SaaS',
      stage: 'Series A',
      description: 'AI-powered workflow automation platform for enterprises',
      location: 'San Francisco, CA',
      founded: '2020',
      employees: '50-100',
    },
    {
      id: 2,
      name: 'HealthSync',
      industry: 'Healthcare',
      stage: 'Seed',
      description: 'Telemedicine platform connecting patients with specialists',
      location: 'New York, NY',
      founded: '2021',
      employees: '10-50',
    },
    {
      id: 3,
      name: 'GreenEnergy Co',
      industry: 'CleanTech',
      stage: 'Series B',
      description: 'Renewable energy solutions for residential and commercial use',
      location: 'Austin, TX',
      founded: '2019',
      employees: '100-200',
    },
    {
      id: 4,
      name: 'SecureNet',
      industry: 'Cybersecurity',
      stage: 'Series A',
      description: 'Next-generation threat detection and response platform',
      location: 'Boston, MA',
      founded: '2020',
      employees: '50-100',
    },
    {
      id: 5,
      name: 'EduLearn',
      industry: 'EdTech',
      stage: 'Seed',
      description: 'Personalized learning platform for K-12 students',
      location: 'Seattle, WA',
      founded: '2022',
      employees: '10-50',
    },
    {
      id: 6,
      name: 'FinanceAI',
      industry: 'Fintech',
      stage: 'Series B',
      description: 'AI-driven financial planning and investment advisory',
      location: 'Chicago, IL',
      founded: '2018',
      employees: '100-200',
    },
  ]

  const filteredStartups = mockStartups.filter((startup) => {
    const matchesSearch =
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      startup.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry =
      selectedIndustry === 'all' || startup.industry === selectedIndustry
    const matchesStage = selectedStage === 'all' || startup.stage === selectedStage
    return matchesSearch && matchesIndustry && matchesStage
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Startups</h1>
          <p className="text-gray-600">
            Explore innovative startups across industries and investment stages
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Startups
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, description, or keywords..."
                  className="w-full px-4 py-3 pl-10 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Industry
                </label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isSearching ? 'Searching...' : 'Search with AI'}
            </button>
          </div>
        </div>

        {/* AI Search Results */}
        {searchResults && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
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
                Sample startups (use search above for AI-powered results)
              </p>
            </div>

            {/* Startup Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
            <div
              key={startup.id}
              className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {startup.name}
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
                    {startup.location}
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {startup.stage}
                </span>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{startup.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Industry:</span>
                  <span className="font-medium text-gray-900">{startup.industry}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Founded:</span>
                  <span className="font-medium text-gray-900">{startup.founded}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Team Size:</span>
                  <span className="font-medium text-gray-900">{startup.employees}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
            </div>
          </>
        )}

        {!searchResults && filteredStartups.length === 0 && (
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
            <p className="text-gray-500 text-lg">No startups found matching your criteria</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscoverStartups

