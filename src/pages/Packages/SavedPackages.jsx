// src/pages/Packages/SavedPackages.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";
import CategorySection from "../../components/Sections/CategorySection";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./styles/SavedPackages.module.scss";

function SavedPackages() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const userEmail = userData?.Member?.Email;

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
        const res = await axios.get("/api/package/saved", {
          params: { email: userEmail },
        });

        setSavedPackages(res.data || []);
        setFilteredPackages(res.data || []);
      } catch (error) {
        console.error("Failed to fetch saved packages. Using fallback data.", error);
        const savedIds = userData?.Profile?.saved || [];
        const fallbackData = localPackages.filter((pkg) => savedIds.includes(pkg.id));
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
            onDetailsClick={(pkgId) => navigate(`/packages?id=${pkgId}`)}
            getCampaignStatus={(pkgId) =>
              savedPackages.find((pkg) => pkg.id === pkgId)?.campaignStatus
            }
          />
        </div>
      )}
    </div>
  );
}

export default SavedPackages;
