import React, { useState } from 'react';
import { Mail, MapPin, Send, Check, Loader2 } from 'lucide-react';
import SoftBackDrop from '../components/SoftBackDrop';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true);

    // Simulate sending data (delay of 2 seconds)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      
      // Optional: Reset button after 3 seconds so user can send another if needed
      setTimeout(() => {
        setIsSent(false);
        // If you want to clear the form fields here, you would need states for them too.
      }, 3000);
    }, 2000);
  };

  return (
    <>
      <SoftBackDrop />

      <div className="pt-24 min-h-screen text-zinc-100 font-sans flex items-center">
        <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Contact Information */}
            <div className="flex flex-col justify-center lg:py-8">
              <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600 mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-12">
                Have a question, feedback, or need support? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <Mail className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-1">Email</h3>
                    <p className="text-zinc-400">support@thumblify.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                    <MapPin className="w-6 h-6 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-1">Location</h3>
                    <p className="text-zinc-400">Vadodara, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-sm relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300">Name</label>
                    <input type="text" id="name" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" required/>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email</label>
                    <input type="email" id="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" required/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-zinc-300">Subject</label>
                  <input type="text" id="subject" placeholder="How can we help?" className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all" required/>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-300">Message</label>
                  <textarea id="message" rows={5} placeholder="Tell us more regarding your inquiry..." className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/30 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-none" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || isSent}
                  className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 
                    ${isSent 
                      ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' 
                      : 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 shadow-pink-500/30'
                    }
                    ${isSubmitting ? 'cursor-wait opacity-90' : ''}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : isSent ? (
                    <>
                      Message Sent
                      <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default ContactPage;