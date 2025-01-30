import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import fallbackData from "../data/localProfile.json";

export const AuthContext = createContext();

const STORAGE_KEY = "authSession";
const FALLBACK_USERNAME = "hackathontest";
const FALLBACK_PASSWORD = "Hac@98910186";

function storeUserSession(username, password) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ username, password }));
}

function loadUserSession() {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const stored = loadUserSession();
    if (stored?.username && stored?.password) {
      setIsAuthenticated(true);
      setUserData({ Profile: fallbackData });
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (userName, password) => {
    try {
      const response = await axios.post("/api/login", { userName, password });
      const { success, profile } = response.data;

      if (!success) {
        throw new Error("Invalid credentials");
      }

      storeUserSession(userName, password);
      setIsAuthenticated(true);
      setUserData({ Profile: profile });
    } catch (err) {
      console.error("API Login error:", err.message);

      if (userName === FALLBACK_USERNAME && password === FALLBACK_PASSWORD) {
        console.log("Using fallback login");
        storeUserSession(userName, password);
        setIsAuthenticated(true);
        setUserData({ Profile: fallbackData });
      } else {
        throw new Error("Login failed and fallback credentials are incorrect");
      }
    }
  };

  const signUp = async (email, userName, password) => {
    try {
      const response = await axios.post("/api/signup", {
        email,
        userName,
        password,
      });
      const { success, profile } = response.data;

      if (!success) {
        throw new Error("Sign up failed");
      }

      storeUserSession(userName, password);
      setIsAuthenticated(true);
      setUserData({ Profile: profile });
    } catch (err) {
      console.error("API Signup error:", err.message);
      throw new Error("Sign up failed. Please try again.");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        isAuthenticated,
        userData,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
