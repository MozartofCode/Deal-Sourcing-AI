import { useState, useEffect } from 'react'
import { analyzeStartup, getPortfolio } from '../services/api'

function StartupAnalysis() {
  const [selectedStartupId, setSelectedStartupId] = useState('')
  const [portfolioStartups, setPortfolioStartups] = useState([])
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState(['comprehensive'])
  const [customQuery, setCustomQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loadingPortfolio, setLoadingPortfolio] = useState(true)

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis', icon: '📊' },
    { value: 'ip', label: 'IP Portfolio', icon: '🔬' },
    { value: 'financials', label: 'Financial Metrics', icon: '💰' },
    { value: 'team', label: 'Founding Team', icon: '👥' },
    { value: 'market', label: 'Market Position', icon: '📈' },
  ]

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      setLoadingPortfolio(true)
      const portfolioData = await getPortfolio()
      setPortfolioStartups(portfolioData)
    } catch (error) {
      console.error('Failed to load portfolio:', error)
    } finally {
      setLoadingPortfolio(false)
    }
  }

  const toggleAnalysisType = (typeValue) => {
    if (selectedAnalysisTypes.includes(typeValue)) {
      // Don't allow deselecting if it's the only one selected
      if (selectedAnalysisTypes.length > 1) {
        setSelectedAnalysisTypes(selectedAnalysisTypes.filter(t => t !== typeValue))
      }
    } else {
      setSelectedAnalysisTypes([...selectedAnalysisTypes, typeValue])
    }
  }

  const handleStartupSelect = (startupId) => {
    setSelectedStartupId(startupId)
  }

  const handleAnalyze = async () => {
    // Selected startup ID must be provided
    if (!selectedStartupId) return
    if (selectedAnalysisTypes.length === 0) return

    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    const selectedStartup = portfolioStartups.find(s => s.id === parseInt(selectedStartupId))
    if (!selectedStartup) {
      setIsAnalyzing(false)
      return
    }
    
    const finalStartupName = selectedStartup.startup_name
    
    try {
      const result = await analyzeStartup(
        finalStartupName,
        selectedAnalysisTypes,
        customQuery.trim() || undefined,
        selectedStartup || undefined
      )
      
      setAnalysisResult({
        startupName: finalStartupName,
        types: selectedAnalysisTypes,
        analysis: result.analysis,
        remainingRequests: result.remaining_requests,
      })
    } catch (err) {
      console.error('Analysis error:', err)
      setAnalysisResult({
        startupName: finalStartupName,
        types: selectedAnalysisTypes,
        error: err.response?.data?.detail || err.message || 'Failed to analyze startup',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canAnalyze = () => {
    return selectedStartupId && selectedAnalysisTypes.length > 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Analysis</h1>
          <p className="text-gray-600">
            Get comprehensive insights on IP, financials, team, and market position. Analyze startups from your portfolio or search for new ones.
          </p>
        </div>

        {/* Analysis Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="space-y-6">
            {/* Portfolio Startup Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Startup from Portfolio
              </label>
              <select
                value={selectedStartupId}
                onChange={(e) => handleStartupSelect(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                disabled={loadingPortfolio}
              >
                <option value="">-- Select a startup from your portfolio --</option>
                {portfolioStartups.map((startup) => (
                  <option key={startup.id} value={startup.id}>
                    {startup.startup_name} {startup.industry ? `(${startup.industry})` : ''}
                  </option>
                ))}
              </select>
              {portfolioStartups.length === 0 && !loadingPortfolio && (
                <p className="mt-2 text-sm text-gray-500">
                  No startups in your portfolio. <a href="/portfolio" className="text-gray-800 underline">Add some here</a>
                </p>
              )}
            </div>

            {/* Custom Query/Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Question
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                placeholder="Ask a specific question about this startup (e.g., 'What are the main risks?', 'How does their pricing compare to competitors?')"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ask specific questions to get targeted insights about the selected startup
              </p>
            </div>

            {/* Analysis Types - Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Types (Select one or more)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {analysisTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleAnalysisType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAnalysisTypes.includes(type.value)
                        ? 'border-gray-800 bg-gray-100'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    {selectedAnalysisTypes.includes(type.value) && (
                      <div className="mt-1 text-xs text-gray-600">Selected</div>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Selected: {selectedAnalysisTypes.length} type{selectedAnalysisTypes.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze() || isAnalyzing}
              className="w-full px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Startup'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Analysis: {analysisResult.startupName}
                </h2>
                {analysisResult.remainingRequests !== undefined && (
                  <span className="text-sm text-gray-500">
                    {analysisResult.remainingRequests} requests remaining
                  </span>
                )}
              </div>

              {analysisResult.types && analysisResult.types.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {analysisResult.types.map((type) => {
                    const typeInfo = analysisTypes.find(t => t.value === type)
                    return (
                      <span
                        key={type}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                      >
                        {typeInfo?.icon} {typeInfo?.label}
                      </span>
                    )
                  })}
                </div>
              )}

              {analysisResult.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{analysisResult.error}</p>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{analysisResult.analysis}</div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                <button className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
                  Save to Portfolio
                </button>
                <button className="px-6 py-2 border border-gray-800 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Export Report
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Share Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {!analysisResult && !isAnalyzing && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Ready to analyze</p>
            <p className="text-gray-400 text-sm">
              Select a startup from your portfolio, choose analysis types, and ask a question
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartupAnalysis
