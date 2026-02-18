import React, { useEffect, useState } from "react";
import SoftBackDrop from "./SoftBackDrop";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";

const Login = () => {
  const [state, setState] = useState("login");
  const { user, login, signUp } = useAuth();
  const navigate = useNavigate();

  // ✅ Loading state
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Submit Handler with Spinner + Disable
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (state === "login") {
        await login(formData);
      } else {
        await signUp(formData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Demo Credentials Autofill
  const fillDemoCredentials = () => {
    setState("login");
    setFormData({
      name: "Demo User",
      email: "test@gmail.com",
      password: "pass",
    });
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <SoftBackDrop />

      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full sm:w-87.5 text-center bg-white/6 border border-white/10 rounded-2xl px-8"
        >
          <h1 className="text-white text-3xl mt-10 font-medium">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Please sign in to continue
          </p>

          {/* Name Field */}
          {state !== "login" && (
            <div className="flex items-center mt-6 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
              <input
                disabled={loading}
                type="text"
                name="name"
                placeholder="Name"
                className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none disabled:opacity-50"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Email Field */}
          <div className="flex items-center w-full mt-4 bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <input
              disabled={loading}
              type="email"
              name="email"
              placeholder="Email id"
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none disabled:opacity-50"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="flex items-center mt-4 w-full bg-white/5 ring-2 ring-white/10 focus-within:ring-pink-500/60 h-12 rounded-full overflow-hidden pl-6 gap-2 transition-all">
            <input
              disabled={loading}
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-transparent text-white placeholder-white/60 border-none outline-none disabled:opacity-50"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Demo Button */}
          <div className="mt-4 text-left flex items-center gap-2">
            <span className="text-sm text-gray-500">Testing?</span>

            <button
              disabled={loading}
              type="button"
              onClick={fillDemoCredentials}
              className="text-sm text-pink-400 hover:underline hover:text-pink-300 transition-colors disabled:opacity-50"
            >
              Click to fill Demo Login
            </button>
          </div>

          {/* ✅ Submit Button with Spinner */}
          <button
            disabled={loading}
            type="submit"
            className={`mt-4 w-full h-11 rounded-full text-white flex items-center justify-center gap-2 transition shadow-lg
              ${
                loading
                  ? "bg-pink-400 cursor-not-allowed"
                  : "bg-pink-600 hover:bg-pink-500 shadow-pink-500/20"
              }`}
          >
            {loading ? (
              <>
                <Loader2Icon className="size-5 animate-spin" />
                {state === "login" ? "Logging in..." : "Signing up..."}
              </>
            ) : state === "login" ? (
              "Login"
            ) : (
              "Sign up"
            )}
          </button>

          {/* Switch Login/Register */}
          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="text-gray-400 text-sm mt-3 mb-11 cursor-pointer select-none"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <span className="text-pink-400 hover:underline ml-1">
              click here
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;