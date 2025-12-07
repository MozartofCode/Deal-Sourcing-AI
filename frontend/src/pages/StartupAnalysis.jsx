import { useState } from 'react'
import { analyzeStartup } from '../services/api'

function StartupAnalysis() {
  const [startupName, setStartupName] = useState('')
  const [analysisType, setAnalysisType] = useState('comprehensive')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis', icon: '📊' },
    { value: 'ip', label: 'IP Portfolio', icon: '🔬' },
    { value: 'financials', label: 'Financial Metrics', icon: '💰' },
    { value: 'team', label: 'Founding Team', icon: '👥' },
    { value: 'market', label: 'Market Position', icon: '📈' },
  ]

  const handleAnalyze = async () => {
    if (!startupName.trim()) return

    setIsAnalyzing(true)
    setAnalysisResult(null)
    try {
      const result = await analyzeStartup(startupName, analysisType)
      // Parse the AI response and structure it
      setAnalysisResult({
        startupName,
        type: analysisType,
        analysis: result.analysis,
        remainingRequests: result.remaining_requests,
      })
    } catch (err) {
      console.error('Analysis error:', err)
      setAnalysisResult({
        startupName,
        type: analysisType,
        error: err.response?.data?.detail || err.message || 'Failed to analyze startup',
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Analysis</h1>
          <p className="text-gray-600">
            Get comprehensive insights on IP, financials, team, and market position
          </p>
        </div>

        {/* Analysis Input */}
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startup Name
              </label>
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                placeholder="Enter startup name or company..."
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {analysisTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setAnalysisType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      analysisType === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-blue-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!startupName.trim() || isAnalyzing}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Startup'}
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
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
              <div className="mt-6 pt-6 border-t border-blue-100 flex gap-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Save to Portfolio
                </button>
                <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">Ready to analyze</p>
            <p className="text-gray-400 text-sm">
              Enter a startup name and select an analysis type to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartupAnalysis

