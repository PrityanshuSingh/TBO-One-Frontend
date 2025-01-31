// src/pages/Packages/SavedPackages.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";
import CategorySection from "../../components/Sections/PackageCategory/CategorySection";
import { FaArrowLeft } from "react-icons/fa";
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

      try {
        const res = await api.get("/api/package/saved", {
          params: { email: userEmail },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setSavedPackages(res.data);
        }
        // setSavedPackages(res.data || []);
        // setFilteredPackages(res.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch saved packages. Using fallback data.",
          error
        );
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
      setFilteredPackages(filtered);
    }
  }, [filterValue, savedPackages]);

  const getCampaignStatus = (pkgId) => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null;
    const foundCampaign = campaigns.find((c) => c.pkgId === pkgId);
    return foundCampaign ? foundCampaign.status : null;
  };
  return (
    <div className={styles.savedContainer}>
      <div className={styles.headerRow}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} />
        </button>
        <h2 className={styles.title}>My Package Vault</h2>
      </div>

      {loading ? (
        <p className={styles.loadingMsg}>Loading saved packages...</p>
      ) : filteredPackages.length === 0 ? (
        <p className={styles.noSavedMsg}>No matching saved packages found.</p>
      ) : (
        <div className={styles.categorySection}>
          <CategorySection
            tag="Saved"
            packages={filteredPackages}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onDetailsClick={(pkgId) => navigate(`/packages/details/${pkgId}`)}
            getCampaignStatus={getCampaignStatus}
          />
        </div>
      )}
    </div>
  );
}

export default SavedPackages;
