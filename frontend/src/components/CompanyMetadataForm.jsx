import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const CompanyMetadataForm = ({
    showForm,
    setShowForm,
    metadata,
    setMetadata
}) => {
    return (
        <div className="w-full max-w-2xl mt-8">
            <button
                onClick={() => setShowForm(!showForm)}
                className="w-full flex items-center justify-between px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                        <Plus className={cn("w-5 h-5 text-cyan-400 transition-transform", showForm && "rotate-45")} />
                    </div>
                    <div className="text-left">
                        <h4 className="font-semibold text-white">Add Company Info (Optional)</h4>
                        <p className="text-xs text-gray-400">Enable AI-powered market intelligence</p>
                    </div>
                </div>
                <ChevronRight className={cn("w-5 h-5 text-gray-400 transition-transform", showForm && "rotate-90")} />
            </button>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 p-6 rounded-xl bg-white/5 border border-white/10 space-y-4">
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3 mb-4">
                                <p className="text-xs text-cyan-300">
                                    💡 <strong>Pro Tip:</strong> Providing company info enables real-time market data, competitor analysis, financial metrics, and news sentiment in your analysis!
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Name
                                    <span className="text-xs text-gray-500 ml-2">(Recommended)</span>
                                </label>
                                <input
                                    type="text"
                                    value={metadata.company_name}
                                    onChange={(e) => setMetadata({ ...metadata, company_name: e.target.value })}
                                    placeholder="e.g., Stripe, Tesla, Acme Corp"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enables news search and sentiment analysis</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Domain
                                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={metadata.company_domain}
                                    onChange={(e) => setMetadata({ ...metadata, company_domain: e.target.value })}
                                    placeholder="e.g., stripe.com, tesla.com"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Provides company data and competitor insights</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Stock Ticker
                                    <span className="text-xs text-gray-500 ml-2">(If public)</span>
                                </label>
                                <input
                                    type="text"
                                    value={metadata.stock_ticker}
                                    onChange={(e) => setMetadata({ ...metadata, stock_ticker: e.target.value.toUpperCase() })}
                                    placeholder="e.g., AAPL, TSLA, SHOP"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Adds financial metrics and stock performance data</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Industry
                                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={metadata.industry}
                                    onChange={(e) => setMetadata({ ...metadata, industry: e.target.value })}
                                    placeholder="e.g., Fintech, SaaS, E-commerce"
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enables industry trend analysis and market context</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setMetadata({
                                            company_name: '',
                                            company_domain: '',
                                            stock_ticker: '',
                                            industry: ''
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-colors text-sm"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 transition-colors text-sm font-medium"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CompanyMetadataForm;
