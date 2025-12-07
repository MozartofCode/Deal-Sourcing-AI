import { useState } from 'react'
import { search as searchAPI } from '../services/api'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [results, setResults] = useState(null)

  const searchTypes = [
    { value: 'all', label: 'All', icon: '🔍' },
    { value: 'startups', label: 'Startups', icon: '🚀' },
    { value: 'founders', label: 'Founders', icon: '👤' },
    { value: 'technologies', label: 'Technologies', icon: '💻' },
    { value: 'markets', label: 'Markets', icon: '📊' },
  ]

  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    try {
      const result = await searchAPI(searchQuery, searchType)
      setResults({
        query: result.query,
        type: result.search_type,
        results: result.results,
        remainingRequests: result.remaining_requests,
      })
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to search')
      console.error('Search error:', err)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search</h1>
          <p className="text-gray-600">
            Search across startups, founders, technologies, and market trends
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for startups, founders, technologies..."
                className="w-full px-4 py-4 pl-12 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
              <svg
                className="absolute left-4 top-4.5 w-5 h-5 text-gray-400"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Type
              </label>
              <div className="flex flex-wrap gap-3">
                {searchTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSearchType(type.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 ${
                      searchType === type.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-blue-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? 'Searching...' : 'Search with AI'}
            </button>
          </div>
        </div>

        {/* Search Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {results && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Results for "{results.query}"
              </p>
              {results.remainingRequests !== undefined && (
                <span className="text-sm text-gray-500">
                  {results.remainingRequests} requests remaining
                </span>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">{results.results}</div>
              </div>
            </div>
          </div>
        )}

        {!results && (
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-12 text-center">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Start your search</p>
            <p className="text-gray-400 text-sm">
              Enter keywords to search across our database of startups, founders, and technologies
            </p>
          </div>
        )}

        {/* Search Tips */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Use specific keywords for better results</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Filter by type to narrow down results</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Search for company names, founder names, or technologies</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Combine multiple keywords for advanced searches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search

