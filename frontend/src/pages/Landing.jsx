import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, ShieldCheck, Zap } from 'lucide-react';

const Landing = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] -z-10" />

            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="Scout Logo" className="w-8 h-8 object-contain" />
                    <span className="text-2xl font-bold tracking-tighter text-white">Scout</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/setup" className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Enter App
                    </Link>
                    <Link to="/setup" className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <main className="flex flex-col items-center justify-center text-center mt-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >


                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-8">
                        <span className="text-white">Automate your</span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                            Diligence Process
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Upload any pitch deck and get an instant, thesis-driven "Proceed" or "Pass" recommendation.
                        Stop wasting time on mismatched deals.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/setup" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-cyan-600 rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600">
                            Start Analyzing Now
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute -inset-3 rounded-full bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </motion.div>

                {/* Features Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4"
                >
                    <FeatureCard
                        icon={<ShieldCheck className="w-8 h-8 text-cyan-400" />}
                        title="Thesis Alignment"
                        desc="We define your investment DNA and check every deal against it."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-cyan-400" />}
                        title="Instant Analysis"
                        desc="Get a detailed report with strengths, weaknesses, and a score in seconds."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-8 h-8 text-cyan-400" />}
                        title="Investment Memos"
                        desc="Auto-generated memos for deals that pass the initial filter."
                    />
                </motion.div>
            </main>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm">
        <div className="mb-4 p-3 bg-white/5 inline-block rounded-xl">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
);

export default Landing;
