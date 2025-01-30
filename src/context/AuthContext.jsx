// AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import fallbackData from "../data/localProfile.json";

export const AuthContext = createContext();

const SESSION_DURATION = 6 * 60 * 60 * 1000;
const STORAGE_KEY = "authSession";

function storeUserSession(user) {
  const expiry = Date.now() + SESSION_DURATION;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, expiry }));
}

function loadUserSession() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const { user, expiry } = JSON.parse(stored);
    if (!user || !expiry) return null;
    if (Date.now() > expiry) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return user;
  } catch (err) {
    console.error("Error parsing localStorage:", err);
    return null;
  }
}

// Sanitize IP to remove commas or extra characters that cause truncation
async function getPublicIP() {
  try {
    const res = await axios.get("https://api64.ipify.org?format=json");
    // Example transformations to avoid trailing commas or invalid chars
    const rawIP = res.data.ip ?? "0.0.0.0";
    return rawIP.trim().replace(/[^\d.]/g, "").substring(0, 50);
  } catch (err) {
    console.error("Error fetching IP:", err);
    return "0.0.0.0";
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const stored = loadUserSession();
    if (stored) {
      setIsAuthenticated(true);
      setUserData(stored);
    }
    setIsAuthLoading(false);
  }, []);

  async function tboAuthenticate(userName, password) {
    const ip = await getPublicIP();
    const payload = {
      ClientId: import.meta.env.VITE_TBO_CLIENT_ID || "ApiIntegrationNew",
      UserName: userName,
      Password: password,
      EndUserIp: ip
    };
    const res = await axios.post("/tbo/auth", payload);
    return res.data; // { Status, TokenId, Error, Member, ...}
  }

  async function tboLogout(tokenId, tokenAgencyId, tokenMemberId) {
    if (!tokenId) return;
    const ip = await getPublicIP();
    const payload = {
      ClientId: import.meta.env.VITE_TBO_CLIENT_ID || "ApiIntegrationNew",
      EndUserIp: ip,
      TokenAgencyId: tokenAgencyId || 222,
      TokenMemberId: tokenMemberId || 111,
      TokenId: tokenId
    };
    try {
      await axios.post("/tbo/logout", payload);
    } catch (err) {
      console.error("TBO logout error =>", err);
    }
  }

  const login = async (userName, password) => {
    try {
      const tboRes = await tboAuthenticate(userName, password);
      if (tboRes.Status !== 1) {
        throw new Error(tboRes.Error?.ErrorMessage || "Invalid TBO credentials");
      }
      const tboEmail = tboRes.Member?.Email;
      if (!tboEmail) {
        throw new Error("TBO response missing email.");
      }

      let Profile;
      try {
        const LoginRes = await axios.get(`/api/agent?email=${tboEmail}`);
        Profile = LoginRes.data?.Profile;
        if (!Profile) {
          throw new Error("No local profile in server response. Sign up first.");
        }
      } catch (err) {
        console.warn("Local profile check failed => fallback used.", err);
        Profile = fallbackData.Profile;
      }

      Profile.ipAddress = await getPublicIP();
      const mergedUser = { ...tboRes, Profile };
      setIsAuthenticated(true);
      setUserData(mergedUser);
      storeUserSession(mergedUser);
    } catch (err) {
      console.error("TBO-based login error =>", err.message);
      throw err;
    }
  };

  const signUp = async (email, userName, password) => {
    try {
      const tboRes = await tboAuthenticate(userName, password);
      if (tboRes.Status !== 1) {
        throw new Error(
          tboRes.Error?.ErrorMessage || "Invalid TBO credentials on sign up"
        );
      }
      const tboEmail = tboRes.Member?.Email;
      if (!tboEmail) {
        throw new Error("TBO response missing email.");
      }
      if (tboEmail.toLowerCase() !== email.toLowerCase()) {
        throw new Error("TBO email does not match signup email.");
      }

      let Profile;
      try {
        const signUpRes = await axios.post("/api/agent", {
          userName,
          email,
          role: "AGENT"
        });
        Profile = signUpRes.data?.Profile;
        if (!Profile) {
          throw new Error("Local signUp did not return a profile.");
        }
      } catch (err) {
        console.warn("Local signUp call failed => fallback profile.", err);
        Profile = fallbackData.Profile;
      }

      Profile.ipAddress = await getPublicIP();
      const mergedUser = { ...tboRes, Profile };
      setIsAuthenticated(true);
      setUserData(mergedUser);
      storeUserSession(mergedUser);
    } catch (err) {
      console.error("SignUp error =>", err.message);
      throw err;
    }
  };

  const logout = async () => {
    if (userData?.TokenId) {
      await tboLogout(
        userData.TokenId,
        userData.Member?.AgencyId,
        userData.Member?.MemberId
      );
    }
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthLoading,
        isAuthenticated,
        userData,
        login,
        signUp,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
