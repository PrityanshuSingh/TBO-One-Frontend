// src/pages/Packages/SavedPackages.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";
import CategorySection from "../../components/Sections/PackageCategory/CategorySection";
import { FaArrowLeft } from "react-icons/fa";
import Load from "../../microInteraction/Load/Load";
import styles from "./styles/SavedPackages.module.scss";

function SavedPackages() {
  const { userData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);
  const navigate = useNavigate();
  const userEmail = userData?.Profile?.email;

  // State for saved packages
  const [savedPackages, setSavedPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState(""); // Category search filter

  // Fetch saved packages from API
  useEffect(() => {
    const fetchSavedPackages = async () => {
      if (!userEmail) return;

      console.log("Fetching saved packages for user:", userEmail);

      try {
        const res = await api.get("/api/packages/saved", {
          params: { agentId: userData?.id },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setSavedPackages(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch saved packages. Using fallback data.", error);
        const savedIds = userData?.Profile?.saved || [];
        console.log("Saved IDs:", savedIds);
        const fallbackData = localPackages.filter((pkg) =>
          savedIds.includes(pkg.id)
        );
        setSavedPackages(fallbackData);
        setFilteredPackages(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPackages();
  }, [userEmail, userData]);

   // Filter saved packages when filterValue changes
  useEffect(() => {
    if (!filterValue.trim()) {
      setFilteredPackages(savedPackages);
    } else {
      const filtered = savedPackages.filter((pkg) =>
        (pkg.packageTitle + " " + pkg.location)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      console.log("Filtered Packages:", filtered);
      setFilteredPackages(filtered);
    }
  }, [filterValue, savedPackages]);

  const getCampaignStatus = (pkgId) => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null;
    const foundCampaign = campaigns.find((c) => c.pkgId === pkgId);
    return foundCampaign ? foundCampaign.status : null;
  };

  const getCampaignType = (pkgId) => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null;

    const foundCampaign = campaigns.find((c) => c.pkgId === pkgId);
    return foundCampaign ? foundCampaign.type : null;
  };

  return (
    <div className={styles.savedContainer}>
      <div className={styles.headerRow}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} />
        </button>
        <h2 className={styles.title}>My Saved Packages</h2>
      </div>

      {loading ? (
        <Load />
      ) : filteredPackages.length === 0 ? (
        <p className={styles.noSavedMsg}>No matching saved packages found.</p>
      ) : (
        <div className={styles.categorySection}>
          <CategorySection
            tag="Saved"
            packages={filteredPackages}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onDetailsClick={(pkgId) => navigate(`/u/packages/details/${pkgId}`)}
            getCampaignStatus={getCampaignStatus}
            getCampaignType={getCampaignType}
          />
        </div>
      )}
    </div>
  );
}

export default SavedPackages;
