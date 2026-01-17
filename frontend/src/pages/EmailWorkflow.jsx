import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function EmailWorkflow() {
    const [emails, setEmails] = useState([])
    const [pipeline, setPipeline] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data for now until backend is connected
        setTimeout(() => {
            setEmails([
                {
                    id: 1,
                    sender_name: 'Alex Chen',
                    subject: 'Pitch: AI for Logistics',
                    received_at: '2025-01-16T10:30:00',
                    classification: 'deal_inquiry',
                    extracted_data: {
                        company_name: 'LogiAI',
                        summary: 'Optimizing last-mile delivery with reinforcement learning',
                        ask: '$2M Seed'
                    }
                },
                {
                    id: 2,
                    sender_name: 'Sarah Jones',
                    subject: 'Re: Meeting next week?',
                    received_at: '2025-01-16T09:15:00',
                    classification: 'meeting_confirmation',
                    extracted_data: {}
                }
            ])

            setPipeline({
                new_lead: 5,
                initial_review: 3,
                follow_up_sent: 2,
                meeting_scheduled: 1,
                due_diligence: 0
            })

            setLoading(false)
        }, 1000)
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Email Workflow Automation</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Sync Emails
                </button>
            </div>

            {/* Pipeline Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {Object.entries(pipeline).map(([stage, count]) => (
                    <div key={stage} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                        <div className="text-sm text-gray-500 uppercase tracking-wide">
                            {stage.replace('_', ' ')}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{count}</div>
                    </div>
                ))}
            </div>

            {/* Recent Emails */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Recent Emails</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                    {emails.map((email) => (
                        <li key={email.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <h3 className="text-sm font-medium text-gray-900">{email.sender_name}</h3>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${email.classification === 'deal_inquiry' ? 'bg-green-100 text-green-800' :
                                                email.classification === 'meeting_confirmation' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {email.classification.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm font-semibold text-gray-700">{email.subject}</p>

                                    {email.extracted_data?.company_name && (
                                        <div className="mt-2 bg-gray-50 p-3 rounded text-sm text-gray-600 border border-gray-100">
                                            <span className="font-medium text-gray-900">AI Extract: </span>
                                            {email.extracted_data.company_name} • {email.extracted_data.ask} • {email.extracted_data.summary}
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button className="text-sm text-blue-600 hover:text-blue-800">
                                        Draft Reply
                                    </button>
                                    {email.classification === 'deal_inquiry' && (
                                        <button className="text-sm text-green-600 hover:text-green-800">
                                            Add to Pipeline
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default EmailWorkflow
