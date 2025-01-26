import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import fallbackData from "../data/localProfile.json";

export const AuthContext = createContext();

const SESSION_DURATION = 6 * 60 * 60 * 1000;
const STORAGE_KEY = "authSession";

// Provide fallback if env variables aren't set
const TBO_AUTH_URL = import.meta.env.VITE_TBO_AUTH_URL;
const TBO_LOGOUT_URL = import.meta.env.VITE_TBO_LOGOUT_URL;
const TBO_CLIENT_ID = import.meta.env.VITE_TBO_CLIENT_ID;

function storeUserSession(user) {
  const expiry = Date.now() + SESSION_DURATION;
  const sessionObj = { user, expiry };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionObj));
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

async function getPublicIP() {
  try {
    const res = await axios.get("https://api64.ipify.org?format=json");
    return res.data.ip;
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
    const storedUser = loadUserSession();
    if (storedUser) {
      setIsAuthenticated(true);
      setUserData(storedUser);
    }
    setIsAuthLoading(false);
  }, []);

  async function tboAuthenticate(userName, password) {
    const ip = await getPublicIP();
    const payload = {
      ClientId: TBO_CLIENT_ID,
      UserName: userName,
      Password: password,
      EndUserIp: ip,
    };
    // If TBO_AUTH_URL is undefined, fallback ensures we have "https://example.com/tbo-auth"
    const res = await axios.post(TBO_AUTH_URL, payload);
    return res.data; // { Status, TokenId, Error, Member, ...}
  }

  async function tboLogout(tokenId, tokenAgencyId, tokenMemberId) {
    if (!tokenId) return;
    const ip = await getPublicIP();
    const payload = {
      ClientId: TBO_CLIENT_ID,
      EndUserIp: ip,
      TokenAgencyId: tokenAgencyId || 222,
      TokenMemberId: tokenMemberId || 111,
      TokenId: tokenId,
    };
    try {
      // fallback ensures TBO_LOGOUT_URL is at least "https://example.com/tbo-logout"
      const res = await axios.post(TBO_LOGOUT_URL, payload);
      console.log("TBO logout =>", res.data);
    } catch (err) {
      console.error("TBO logout error =>", err);
    }
  }

  const login = async (userName, password) => {
    try {
      const tboRes = await tboAuthenticate(userName, password);
      if (tboRes.Status !== 1) {
        throw new Error(
          tboRes.Error?.ErrorMessage || "Invalid TBO credentials"
        );
      }
      const tboEmail = tboRes.Member?.Email;
      if (!tboEmail) throw new Error("TBO response missing email.");

      let Profile;
      try {
        // Attempt server profile. If fails, fallback.
        const LoginRes = await axios.get(`/api/agent?email=${tboEmail}`);
        Profile = LoginRes.data?.Profile;
        if (!Profile) {
          throw new Error(
            "No local profile in server response. Sign up first."
          );
        }
      } catch (err) {
        console.warn("Local agent check failed => fallback used.", err);
        Profile = fallbackData.Profile;
      }

      if (Profile) {
        Profile.ipAddress = await getPublicIP();

        const mergedUser = { ...tboRes, Profile: Profile };
        setIsAuthenticated(true);
        setUserData(mergedUser);
        storeUserSession(mergedUser);
      }
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
      if (!tboEmail) throw new Error("TBO response missing email.");
      if (tboEmail.toLowerCase() !== email.toLowerCase()) {
        throw new Error("TBO email does not match signup email.");
      }
      let Profile;
      try {
        // Attempt local sign-up. If fails, fallback.
        const signUpRes = await axios.post("/api/agent", {
          userName,
          email,
          role: "AGENT",
        });
        Profile = signUpRes.data?.Profile;
        if (!Profile) {
          throw new Error("Local signUp did not return a profile.");
        }
      } catch (err) {
        console.warn("Local signUp call failed => fallback profile.", err);
        Profile = fallbackData.Profile;
      }
      if (Profile) {
        Profile.ipAddress = await getPublicIP();

        const mergedUser = { ...tboRes, Profile: Profile };
        setIsAuthenticated(true);
        setUserData(mergedUser);
        storeUserSession(mergedUser);
      }
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
