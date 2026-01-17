import { MenuIcon, XIcon, LogOut, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu
  const [showProfileMenu, setShowProfileMenu] = useState(false); // Desktop Profile Menu
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    setIsOpen(false);
    navigate('/'); 
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur-md bg-black/10 border-b border-white/5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 70 }}
      >
        {/* Logo */}
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-8 md:h-9 w-auto hover:opacity-80 transition" />
        </Link>

        {/* Desktop Links - "My Generations" RESTORED HERE */}
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-300">
          <Link to="/" className="hover:text-pink-400 transition-colors">Home</Link>
          <Link to="/generate" className="hover:text-pink-400 transition-colors">Generate</Link>
          
          {/* ✅ RESTORED: This link is back in the main bar */}
          {isLoggedIn && (
            <Link to="/my-generation" className="hover:text-pink-400 transition-colors">
              My Generations
            </Link>
          )}
          
          <Link to="/about" className="hover:text-pink-400 transition-colors">About</Link>
          <Link to="/contact" className="hover:text-pink-400 transition-colors">
            Contact Us
          </Link>
        </div>

        {/* Right Side (User Profile / Login) */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center rounded-full size-10 bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold border-2 border-white/10 hover:border-pink-500 transition-all shadow-lg shadow-pink-500/20"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="size-5"/>}
              </button>

              {/* Profile Dropdown - LOGOUT ONLY */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-12 right-0 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">User Account</p>
                    </div>
                    
                    {/* ✅ Logout Button ONLY (My Generations removed from here) */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-medium transition-all rounded-full shadow-lg shadow-pink-600/20"
            >
              Get Started
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="md:hidden text-white hover:text-pink-400 transition-colors"
          >
            <MenuIcon size={28} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-xl md:hidden"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <XIcon size={24} />
            </button>

            <Link onClick={() => setIsOpen(false)} to="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <Link onClick={() => setIsOpen(false)} to="/generate" className="hover:text-pink-500 transition-colors">Generate</Link>
            
            {/* ✅ RESTORED in Mobile Menu as well */}
            {isLoggedIn && (
              <Link onClick={() => setIsOpen(false)} to="/my-generation" className="hover:text-pink-500 transition-colors">
                My Generations
              </Link>
            )}
            
            <Link onClick={() => setIsOpen(false)} to="/about" className="hover:text-pink-500 transition-colors">About</Link>
            <Link onClick={() => setIsOpen(false)} to="/contact" className="hover:text-pink-500 transition-colors">
              Contact Us
            </Link>

            <div className="h-px w-24 bg-white/20 my-4" />

            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            ) : (
              <Link 
                onClick={() => setIsOpen(false)} 
                to="/login"
                className="px-8 py-3 bg-pink-600 rounded-full text-white font-semibold hover:bg-pink-700 transition-all"
              >
                Login / Signup
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}