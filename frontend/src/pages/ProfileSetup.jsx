import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { logError } from '../lib/utils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [profileExists, setProfileExists] = useState(false);
    const [formData, setFormData] = useState({
        thesis: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${API_URL}/profiles/`);
                if (res.data) {
                    setProfileExists(true);
                    setFormData({
                        thesis: res.data.thesis || ''
                    });
                }
            } catch (e) {
                // Ignore 404 - profile doesn't exist yet
                if (e.response && e.response.status === 404) {
                    setProfileExists(false);
                } else {
                    logError("ProfileSetup/fetchProfile", e);
                    setProfileExists(false);
                }
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/profiles/`, formData);
            navigate('/dashboard');
        } catch (error) {
            const msg = logError("ProfileSetup/submit", error);
            alert(`Failed to save profile: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto glass-card p-8 rounded-2xl"
            >
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                        <img src="/logo.png" alt="Scout Logo" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-bold tracking-tighter text-white">Scout</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Define Your Thesis</h1>
                    <p className="text-gray-400">The AI will use this criteria to evaluate every deal.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Core Investment Thesis</label>
                        <textarea
                            name="thesis"
                            required
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
                            placeholder="e.g. We invest in B2B SaaS companies in Europe with strong PLG motion..."
                            value={formData.thesis}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4 space-y-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (profileExists ? 'Update Thesis' : 'Save & Continue')}
                        </button>
                        {profileExists && (
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors border border-white/10"
                            >
                                Back to Dashboard
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfileSetup;
