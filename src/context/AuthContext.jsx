import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api";
import fallbackData from "../data/localProfile.json";

export const AuthContext = createContext();

const STORAGE_KEY = "authSession";
const FALLBACK_USERNAME = "hackathontest";
const FALLBACK_PASSWORD = "Hac@98910186";

// Stores the profile along with username and password
function storeUserSession(username, password, profile) {
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ username, password, profile })
  );
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
    if (stored?.username && stored?.password && stored.profile) {
      console.log("Stored session found. Loading profile from storage...");
      setIsAuthenticated(true);
      setUserData(stored.profile);
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (userName, password) => {
    try {
      const response = await api.post("/api/auth/login", { userName, password });
      const { success, profile } = response.data;
      if (!success) {
        throw new Error("Invalid credentials");
      }
      storeUserSession(userName, password, profile);
      setIsAuthenticated(true);
      setUserData(profile);
    } catch (err) {
      console.error("API Login error:", err.message);
      // Fallback login for testing/offline mode
      if (userName === FALLBACK_USERNAME && password === FALLBACK_PASSWORD) {
        console.log("Using fallback login");
        storeUserSession(userName, password, fallbackData);
        setIsAuthenticated(true);
        setUserData(fallbackData);
      } else {
        throw new Error("Login failed and fallback credentials are incorrect");
      }
    }
  };

  const signUp = async (email, userName, password) => {
    try {
      const response = await api.post("/api/auth/signup", { email, userName, password });
      const { success, profile } = response.data;
      if (!success) {
        throw new Error("Sign up failed");
      }
      storeUserSession(userName, password, profile);
      setIsAuthenticated(true);
      setUserData(profile);
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

  // Updated to support a callback updater function (like React's setState)
  const updateUserData = (updater) => {
    setUserData((prev) => {
      // Allow updater to be a function or an object
      const newData = typeof updater === "function" ? updater(prev) : updater;
      const updatedProfile = { ...prev, ...newData };
      const stored = loadUserSession();
      if (stored) {
        storeUserSession(stored.username, stored.password, updatedProfile);
      }
      return updatedProfile;
    });
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
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
