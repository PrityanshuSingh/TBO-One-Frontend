// src/context/CampaignContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "./AuthContext";
import fallbackPackages from "../data/localPackages.json";

export const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const { userData, isAuthenticated, updateUserProfile } = useContext(AuthContext);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [campaignError, setCampaignError] = useState("");

  // Fetch campaigns from AuthContext when userData changes (i.e., after login)
  useEffect(() => {
    if (isAuthenticated && userData?.Profile?.campaigns) {
      setCampaigns(userData.Profile.campaigns);
    } else {
      setCampaigns([]); // Clear campaigns if not authenticated
    }
    setIsLoading(false);
  }, [isAuthenticated, userData]);

  // Function to delete campaigns
  const deleteCampaigns = async (campaignIds) => {
    setCampaignError("");
    try {
      await Promise.all(
        campaignIds.map((id) => api.delete(`/api/campaigns/${id}`))
      );

      // Update local campaigns state
      const updatedCampaigns = campaigns.filter(
        (campaign) => !campaignIds.includes(campaign.id)
      );
      setCampaigns(updatedCampaigns);

      // Update AuthContext's userData via updateUserProfile
      updateUserProfile({
        ...userData.Profile,
        campaigns: updatedCampaigns,
      });
    } catch (error) {
      console.error("Failed to delete campaigns.", error);
      setCampaignError(
        "Failed to delete selected campaigns. Please try again."
      );
      throw error; // Re-throw to handle in the UI if needed
    }
  };

  // Function to fetch additional package details if needed
  const fetchPackageDetails = async () => {
    const ids = [...new Set(campaigns.map((campaign) => campaign.pkgId))];

    try {
      const fetchPromises = ids.map((id) =>
        api.get(`/api/packages/${id}`).then((res) => ({
          id,
          packageTitle: res.data.packageTitle, // Adjust according to API response
        }))
      );

      const fetchedPackages = await Promise.all(fetchPromises);
      console.log("Fetched package details:", fetchedPackages);

      // Create a mapping of id to packageTitle
      const packagesMap = {};
      fetchedPackages.forEach(({ id, packageTitle }) => {
        packagesMap[id] = packageTitle;
      });

      return packagesMap;
    } catch (error) {
      console.error("Failed to fetch package details. Using fallback data.", error);
      const packagesMap = {};
      const fetchedPackages = fallbackPackages;
      fetchedPackages.forEach(({ id, packageTitle }) => {
        packagesMap[id] = packageTitle;
      });
      console.log("Fetched package details (fallback):", packagesMap);
      return packagesMap;
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        setCampaigns,
        deleteCampaigns,
        isLoading,
        campaignError,
        fetchPackageDetails,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
