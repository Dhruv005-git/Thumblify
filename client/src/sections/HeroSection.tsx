'use client'
import { useState } from "react";
import { CheckIcon, Sparkles, VideoIcon, X } from "lucide-react";
import TiltedImage from "../components/TiltImage";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const specialFeatures = [
        "No design skills needed",
        "Fast generation",
        "High CTR templates",
    ];

    return (
        <div className="relative flex flex-col items-center justify-center px-4 md:px-16 lg:px-24 xl:px-32">
            
            {/* Background Gradient */}
            <div className="absolute top-30 -z-10 left-1/4 size-72 bg-pink-600 blur-[300px]"></div>

            {/* "NEW" Badge */}
            <motion.a className="group flex items-center gap-2 rounded-full p-1 pr-3 mt-44 text-pink-100 bg-pink-200/15"
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <span className="bg-pink-800 text-white text-xs px-3.5 py-1 rounded-full">
                    NEW
                </span>
                <p className="flex items-center gap-1">
                    <span>Generate your first thumbnail for free </span>
                    <Sparkles size={16} className="group-hover:translate-x-0.5 transition duration-300" />
                </p>
            </motion.a>

            {/* Main Title */}
            <motion.h1 className="text-5xl/17 md:text-6xl/21 font-medium max-w-3xl text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
            >
                AI Thumbnail Generator for your <span className="move-gradient px-3 rounded-xl text-nowrap">Videos.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="text-base text-center text-slate-200 max-w-lg mt-6"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                Stop wasting hours on design. Get high-converting thumbnails in seconds with our advanced AI.
            </motion.p>

            {/* Buttons Area */}
            <motion.div className="flex items-center gap-4 mt-8"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
            >
                <button 
                    onClick={() => navigate('/generate')} 
                    className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-7 h-11 transition-colors"
                >
                    Generate Now
                </button>
                
                <button 
                    onClick={() => setIsVideoOpen(true)}
                    className="flex items-center gap-2 border border-pink-900 hover:bg-pink-950/50 transition rounded-full px-6 h-11 text-white"
                >
                    <VideoIcon strokeWidth={1} />
                    <span>See how it works</span>
                </button>
            </motion.div>

            {/* Features List */}
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-14 mt-12">
                {specialFeatures.map((feature, index) => (
                    <motion.p className="flex items-center gap-2" key={index}
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2, duration: 0.3 }}
                    >
                        <CheckIcon className="size-5 text-pink-600" />
                        <span className="text-slate-400">{feature}</span>
                    </motion.p>
                ))}
            </div>

            {/* 3D Tilted Image Component */}
            <TiltedImage />

            {/* -------------------------------------------
               VIDEO MODAL IMPLEMENTATION
               ------------------------------------------- */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl bg-[#0f0f11] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-pink-600 rounded-full text-white transition-colors"
                            >
                                <X className="size-5" />
                            </button>

                            {/* Video Embed */}
                            <div className="relative aspect-video">
                                <iframe 
                                    className="w-full h-full"
                                    // 👇 ID inserted correctly here
                                    src="https://www.youtube.com/embed/hvylqs1vnCA?rel=0" 
                                    title="Product Demo"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}