import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import toast from "react-hot-toast";

interface AuthContextProps {
  isLoggedIn: boolean;
  setisLoggedIn: (isLoggedIn: boolean) => void;
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  login: (user: { email: string; password: string }) => Promise<void>;
  signUp: (user: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setisLoggedIn: () => {},
  user: null,
  setUser: () => {},
  login: async () => {},
  signUp: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setisLoggedIn] = useState<boolean>(false);

  const signUp = async ({ name, email, password }: { name: string; email: string; password: string }) => {
    try {
      const { data } = await api.post("/api/auth/register", { name, email, password });
      if (data.user) {
        setUser(data.user as IUser);
        setisLoggedIn(true);
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      // FIX: Show error toast from backend response
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      if (data.user) {
        setUser(data.user as IUser);
        setisLoggedIn(true);
        toast.success(data.message);
      }
    } catch (error: any) {
      console.log(error);
      // FIX: Show error toast from backend response
      // This will now show "Invalid credentials" or whatever your backend sends
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      const { data } = await api.post("/api/auth/logout");
      setUser(null);
      setisLoggedIn(false);
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/auth/verify");
      if (data.user) {
        // BUG FIX: You were doing setUser(null) here previously!
        setUser(data.user as IUser); 
        setisLoggedIn(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUser();
    })();
  }, []);

  const value = {
    user,
    setUser,
    isLoggedIn,
    setisLoggedIn,
    signUp,
    login,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);