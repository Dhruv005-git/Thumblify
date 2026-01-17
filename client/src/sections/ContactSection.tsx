'use client'
import { useState } from "react";
import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon, Loader2, Check } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        // fake async submit (2 seconds delay)
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Auto-reset button state after 3 seconds
            setTimeout(() => {
                setSuccess(false);
                // Optional: You could reset form fields here if you were using state for inputs
            }, 3000);
        }, 2000);
    }

    return (
        <div className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle
                text1="Contact"
                text2="Grow your channel"
                text3="Have questions about our AI? Ready to scale your views? Let's talk."
            />

            <form
                onSubmit={handleSubmit}
                className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full"
            >
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    <p className="mb-2 font-medium">Your name</p>
                    <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <UserIcon className="size-5" />
                        <input
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            className="w-full p-3 bg-transparent outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <p className="mb-2 font-medium">Email id</p>
                    <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <MailIcon className="size-5" />
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className="w-full p-3 bg-transparent outline-none placeholder:text-slate-500"
                            required
                        />
                    </div>
                </motion.div>

                <motion.div
                    className="sm:col-span-2"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                >
                    <p className="mb-2 font-medium">Message</p>
                    <textarea
                        name="message"
                        rows={8}
                        placeholder="Enter your message"
                        className="focus:border-pink-500 resize-none w-full p-3 bg-transparent outline-none rounded-lg border border-slate-700 transition-colors placeholder:text-slate-500"
                        required
                    />
                </motion.div>

                {/* CENTERED SUBMIT BUTTON WITH ANIMATION LOGIC */}
                <motion.div
                    className="sm:col-span-2 flex justify-center"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
                >
                    <button
                        type="submit"
                        disabled={loading || success}
                        className={`flex items-center gap-2 px-10 py-3 rounded-full text-white font-medium transition-all duration-300 shadow-lg
                            ${success 
                                ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" 
                                : "bg-pink-600 hover:bg-pink-700 shadow-pink-500/20"
                            }
                            ${loading ? "opacity-90 cursor-wait" : ""}
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                Submitting...
                            </>
                        ) : success ? (
                            <>
                                Message Sent
                                <Check className="size-5" />
                            </>
                        ) : (
                            <>
                                Submit
                                <ArrowRightIcon className="size-5" />
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </div>
    );
}