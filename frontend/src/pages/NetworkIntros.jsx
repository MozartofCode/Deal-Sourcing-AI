import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function NetworkIntros() {
    const [startupName, setStartupName] = useState('')
    const [results, setResults] = useState(null)
    const [searching, setSearching] = useState(false)

    const handleSearch = (e) => {
        e.preventDefault()
        setSearching(true)
        // Mock search
        setTimeout(() => {
            setResults([
                {
                    founder: { name: 'David Kim', title: 'CEO', linkedin: '...' },
                    path: ['ME', 'Sarah Chen (VP at Sequoia)', 'David Kim'],
                    strength: 0.9,
                    type: '2nd Degree'
                },
                {
                    founder: { name: 'Emily White', title: 'CTO', linkedin: '...' },
                    path: ['ME', 'Mike Ross (Angel Investor)', 'Emily White'],
                    strength: 0.7,
                    type: '2nd Degree'
                }
            ])
            setSearching(false)
        }, 1500)
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Find Warm Introductions</h1>

                <form onSubmit={handleSearch} className="mb-12">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={startupName}
                            onChange={(e) => setStartupName(e.target.value)}
                            placeholder="Enter startup name (e.g. Stripe)"
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={searching || !startupName}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {searching ? 'Searching...' : 'Find Path'}
                        </button>
                    </div>
                </form>

                {results && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-medium text-gray-900">Connection Paths</h2>
                        {results.map((result, i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">{result.founder.name} <span className="text-gray-500 text-sm font-normal">({result.founder.title})</span></h3>
                                        <div className="text-sm text-blue-600 font-medium">{result.type} Connection</div>
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                        Strength: {(result.strength * 10).toFixed(1)}/10
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
                                    {result.path.map((node, idx) => (
                                        <React.Fragment key={idx}>
                                            <span className={node === 'ME' ? 'font-bold text-gray-900' : ''}>{node}</span>
                                            {idx < result.path.length - 1 && (
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>

                                <div className="flex space-x-3">
                                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium">
                                        View LinkedIn
                                    </button>
                                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
                                        Draft Intro Request
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default NetworkIntros
