import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, XCircle, Plus, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, logError } from '../lib/utils';
import CompanyMetadataForm from '../components/CompanyMetadataForm';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [showMetadataForm, setShowMetadataForm] = useState(false);
    const fileInputRef = useRef(null);

    // Company metadata state for enhanced analysis
    const [companyMetadata, setCompanyMetadata] = useState({
        company_name: '',
        company_domain: '',
        stock_ticker: '',
        industry: ''
    });

    useEffect(() => {
        fetchProfileAndReports();
    }, []);

    const fetchProfileAndReports = async () => {
        try {
            const profileRes = await axios.get(`${API_URL}/profiles/`);
            if (!profileRes.data) {
                navigate('/setup');
                return;
            }

            const res = await axios.get(`${API_URL}/analysis/`);
            setReports(res.data);
            if (res.data.length > 0) {
                setSelectedReport(res.data[0]);
            }
        } catch (error) {
            console.error("Dashboard data fetch error:", error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // Add company metadata if provided (enables external API enrichment)
        if (companyMetadata.company_name) formData.append('company_name', companyMetadata.company_name);
        if (companyMetadata.company_domain) formData.append('company_domain', companyMetadata.company_domain);
        if (companyMetadata.stock_ticker) formData.append('stock_ticker', companyMetadata.stock_ticker);
        if (companyMetadata.industry) formData.append('industry', companyMetadata.industry);

        setAnalyzing(true);
        try {
            const res = await axios.post(`${API_URL}/analysis/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setReports([res.data, ...reports]);
            setSelectedReport(res.data);

            // Reset metadata form
            setCompanyMetadata({
                company_name: '',
                company_domain: '',
                stock_ticker: '',
                industry: ''
            });
            setShowMetadataForm(false);
        } catch (error) {
            const msg = logError("Dashboard/upload", error);
            alert(`Analysis failed: ${msg}`);
        } finally {
            setAnalyzing(false);
        }
    };

    const DecisionBadge = ({ decision }) => {
        const styles = {
            PROCEED: 'bg-green-500/20 text-green-400 border-green-500/30',
            CAUTION: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            PASS: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
        const icons = {
            PROCEED: CheckCircle,
            CAUTION: AlertTriangle,
            PASS: XCircle
        };
        const Icon = icons[decision] || AlertTriangle;

        return (
            <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full border border-dashed", styles[decision] || styles.CAUTION)}>
                <Icon className="w-5 h-5" />
                <span className="font-bold tracking-wide">{decision}</span>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 border-r border-white/10 flex flex-col glass bg-black/20">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/logo.png" alt="Scout Logo" className="w-8 h-8 object-contain" />
                        <h2 className="text-xl font-bold tracking-tight text-white">Scout</h2>
                    </div>
                    <button
                        onClick={() => { setSelectedReport(null); }}
                        className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-600/10 text-cyan-400 hover:bg-cyan-600/20 border border-cyan-500/30 transition-all font-medium"
                    >
                        <Plus className="w-4 h-4" /> New Analysis
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => setSelectedReport(report)}
                            className={cn(
                                "p-4 rounded-xl cursor-pointer transition-all border",
                                selectedReport?.id === report.id
                                    ? "bg-white/10 border-white/20"
                                    : "bg-transparent border-transparent hover:bg-white/5"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium truncate max-w-[120px] text-sm text-gray-200">{report.deck_filename || "Unknown Deck"}</span>
                                <span className={cn("text-xs font-bold",
                                    report.decision === 'PROCEED' ? "text-green-400" :
                                        report.decision === 'PASS' ? "text-red-400" : "text-yellow-400"
                                )}>{report.decision}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                                Score: {report.score}/100
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => navigate('/setup')}
                        className="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Profile Settings
                    </button>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
                            <div className="text-sm font-medium">{user?.name || user?.email || 'Invest'}</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 relative">
                <AnimatePresence mode="wait">
                    {!selectedReport ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="h-full flex flex-col items-center justify-center -mt-10"
                        >
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={cn(
                                    "w-full max-w-2xl h-80 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all group",
                                    analyzing ? "border-cyan-500/50 bg-cyan-900/10 pointer-events-none" : "border-white/20 hover:border-cyan-500/50 hover:bg-white/5"
                                )}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    accept="application/pdf, text/plain, .md, .txt"
                                />

                                {analyzing ? (
                                    <div className="flex flex-col items-center text-cyan-400">
                                        <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                                        <p className="text-lg font-medium animate-pulse">Analyzing Deal Structure...</p>
                                        <p className="text-sm text-gray-400 mt-2">Checking thesis fit...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Upload Pitch Deck</h3>
                                        <p className="text-gray-400 max-w-sm text-center">Drag & drop your PDF or Text file here. We'll analyze it against your thesis instantly.</p>
                                        <p className="text-xs text-gray-500 mt-2">(Note: Scanned PDFs without text are not supported)</p>
                                    </>
                                )}
                            </div>

                            {/* Company Metadata Form */}
                            <CompanyMetadataForm
                                showForm={showMetadataForm}
                                setShowForm={setShowMetadataForm}
                                metadata={companyMetadata}
                                setMetadata={setCompanyMetadata}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="report"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="max-w-4xl mx-auto space-y-8 pb-20"
                        >
                            {/* Report Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{selectedReport.deck_filename}</h1>
                                    <p className="text-gray-400 text-sm">Analyzed on {new Date(selectedReport.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <DecisionBadge decision={selectedReport.decision} />
                                    <div className="text-sm font-medium text-gray-400">Match Score: <span className="text-white">{selectedReport.score}%</span></div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-cyan-400" /> Executive Summary
                                </h3>
                                <p className="text-gray-300 leading-relaxed">
                                    {selectedReport.summary}
                                </p>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-green-500/50">
                                    <h3 className="text-lg font-semibold mb-4 text-green-400">Strengths</h3>
                                    <ul className="space-y-3">
                                        {selectedReport.strengths && selectedReport.strengths.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                                <CheckCircle className="w-4 h-4 text-green-500/50 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500/50">
                                    <h3 className="text-lg font-semibold mb-4 text-red-400">Weaknesses</h3>
                                    <ul className="space-y-3">
                                        {selectedReport.weaknesses && selectedReport.weaknesses.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                                <XCircle className="w-4 h-4 text-red-500/50 mt-0.5 shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Enhanced Analysis Sections (if available) */}
                            {(selectedReport.analysis_json?.market_insights ||
                                selectedReport.analysis_json?.competitive_analysis ||
                                selectedReport.analysis_json?.financial_health) && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 text-sm text-cyan-400">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                                            <span>Enhanced with real-time market intelligence</span>
                                        </div>

                                        {selectedReport.analysis_json?.market_insights &&
                                            selectedReport.analysis_json.market_insights !== 'N/A' && (
                                                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500/50">
                                                    <h3 className="text-lg font-semibold mb-3 text-blue-400">Market Insights</h3>
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        {selectedReport.analysis_json.market_insights}
                                                    </p>
                                                </div>
                                            )}

                                        {selectedReport.analysis_json?.competitive_analysis &&
                                            selectedReport.analysis_json.competitive_analysis !== 'N/A' && (
                                                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500/50">
                                                    <h3 className="text-lg font-semibold mb-3 text-purple-400">Competitive Analysis</h3>
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        {selectedReport.analysis_json.competitive_analysis}
                                                    </p>
                                                </div>
                                            )}

                                        {selectedReport.analysis_json?.financial_health &&
                                            selectedReport.analysis_json.financial_health !== 'N/A' && (
                                                <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500/50">
                                                    <h3 className="text-lg font-semibold mb-3 text-emerald-400">Financial Health</h3>
                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                        {selectedReport.analysis_json.financial_health}
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
