import { useState } from 'react';
import { Zap, Sparkles, Palette } from 'lucide-react';
import SoftBackDrop from '../components/SoftBackDrop'; 

const AboutPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialText = [
    "Thumbify is an AI-powered platform built to help creators design eye-catching, high-converting YouTube thumbnails in seconds - without needing advanced design skills.",
    "In today's crowded creator economy, first impressions decide everything. A strong thumbnail can be the difference between getting ignored and getting clicked. Thumbify was created to remove the guesswork and turn proven design principles into automated, intelligent visuals.",
    "Our AI analyzes composition, color contrast, facial focus, text placement, and visual hierarchy to help you generate thumbnails that naturally attract attention in YouTube feeds and recommendations."
  ];

  const expandedText = [
    "Whether you're a full-time YouTuber, a growing creator, a brand, or a marketing team, Thumbify helps you publish faster, stay visually consistent, and increase click-through rates - without slowing down your workflow.",
    "We believe great design shouldn't be locked behind expensive tools or steep learning curves. Thumbify exists to give every creator access to professional-quality thumbnails, powered by AI and refined by creative control.",
    "Thumbify is built around real-world creator workflows. Instead of starting from a blank canvas, you get intelligent thumbnail suggestions that are designed to perform — and the freedom to tweak every detail to match your channel's style and audience.",
    "From bold text layouts to optimized color contrast and subject emphasis, every generated thumbnail follows design patterns commonly used by top-performing content creators. Our goal is not just to make thumbnails look good, but to make them work.",
    "We also prioritize speed and simplicity. Thumbify eliminates repetitive design tasks so you can focus on what matters most: creating content, publishing consistently, and growing your channel with confidence.",
    "As the platform evolves, we're continuously improving our AI models, adding new customization options, and refining our tools based on creator feedback — ensuring Thumbify grows alongside your creative journey.",
    "At its core, Thumbify is more than a design tool. It's a growth companion built to help creators stand out, get noticed, and turn views into lasting audiences."
  ];

  return (
    <>
      <SoftBackDrop />
      
      <div className="pt-24 min-h-screen text-zinc-100 font-sans">
        <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 pb-28">
          
          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
            
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-2 text-white">
                About
              </h1>
              <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 mb-10 pb-2">
                Thumbify
              </h2>

              <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
                {initialText.map((paragraph, index) => (
                  <p key={`init-${index}`}>{paragraph}</p>
                ))}

                {/* Collapsible Content */}
                <div 
                  className={`space-y-6 overflow-hidden transition-all duration-700 ease-in-out ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {expandedText.map((paragraph, index) => (
                    <p key={`exp-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-8 font-semibold text-white hover:text-pink-400 transition-colors w-fit flex items-center gap-2 group cursor-pointer"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
                <span className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                  ↓
                </span>
              </button>
            </div>

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                  <h3 className="text-3xl font-bold mb-8 text-white">Why Choose Us?</h3>
                  
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-white/5 rounded-lg h-fit">
                        <Zap className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1 text-zinc-100">Lightning Fast</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">Generate professional thumbnails in seconds, not hours.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-white/5 rounded-lg h-fit">
                        <Sparkles className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1 text-zinc-100">AI Powered</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">Leverage state-of-the-art AI to optimize for clicks.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="mt-1 p-2 bg-white/5 rounded-lg h-fit">
                        <Palette className="w-6 h-6 text-pink-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-1 text-zinc-100">Fully Customizable</h4>
                        <p className="text-zinc-400 text-sm leading-relaxed">Edit every detail to match your brand's unique style.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 lg:mt-32">
            <FeatureCard 
              title="Built for Creators"
              description="Designed with real creator workflows in mind — from solo YouTubers to growing content teams."
            />
            <FeatureCard 
              title="AI + Human Control"
              description="AI gives you the starting point. You stay in control with full customization and creative freedom."
            />
            <FeatureCard 
              title="Focused on Results"
              description="Every feature is built to help improve visibility, engagement, and long-term channel growth."
            />
          </div>

        </main>
      </div>
    </>
  );
};

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300">
    <h3 className="text-xl font-bold mb-3 text-zinc-100">{title}</h3>
    <p className="text-zinc-400 leading-relaxed text-sm">
      {description}
    </p>
  </div>
);

export default AboutPage;