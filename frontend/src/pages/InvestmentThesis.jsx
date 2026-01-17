import React, { useState, useEffect } from 'react'

function InvestmentThesis() {
    const [thesis, setThesis] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data
        setTimeout(() => {
            setThesis({
                confidence_score: 0.85,
                preferred_industries: {
                    'FinTech': 0.8,
                    'SaaS': 0.6,
                    'HealthTech': 0.4
                },
                preferred_stages: {
                    'Seed': 0.9,
                    'Series A': 0.5,
                    'Pre-Seed': 0.3
                },
                key_criteria: [
                    'Strong technical co-founder',
                    'Network effects',
                    '>$10k MRR',
                    'Clear path to profitability'
                ]
            })
            setLoading(false)
        }, 1000)
    }, [])

    if (loading) return <div className="p-8">Loading thesis...</div>

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Learned Investment Thesis</h1>
                <p className="mt-2 text-gray-600">
                    AI analysis of your preferences based on past deal interactions.
                    Confidence Score: <span className="font-semibold text-green-600">{(thesis.confidence_score * 100).toFixed(0)}%</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Industries */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Preferred Industries</h2>
                    <div className="space-y-4">
                        {Object.entries(thesis.preferred_industries).map(([ind, score]) => (
                            <div key={ind}>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span>{ind}</span>
                                    <span>{(score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${score * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stages */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Preferred Stages</h2>
                    <div className="space-y-4">
                        {Object.entries(thesis.preferred_stages).map(([stage, score]) => (
                            <div key={stage}>
                                <div className="flex justify-between text-sm font-medium mb-1">
                                    <span>{stage}</span>
                                    <span>{(score * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-purple-600 h-2 rounded-full"
                                        style={{ width: `${score * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Key Criteria */}
                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Key Investment Criteria</h2>
                    <div className="flex flex-wrap gap-2">
                        {thesis.key_criteria.map((criteria, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm border border-gray-200">
                                {criteria}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvestmentThesis
