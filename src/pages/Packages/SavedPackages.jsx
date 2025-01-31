// src/pages/Packages/SavedPackages.jsx

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";
import CategorySection from "../../components/Sections/PackageCategory/CategorySection";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./styles/SavedPackages.module.scss";

function SavedPackages() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const userEmail = userData?.Profile?.email;

  const [savedPackages, setSavedPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchSavedPackages = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("/api/package/saved", {
          params: { email: userEmail },
        });

        // Ensure res.data is an array or convert it properly
        let data = res.data;
        if (!Array.isArray(data)) {
          // Check if data might have a "packages" array or fallback to empty array
          data = Array.isArray(data?.packages) ? data.packages : [];
        }

        // setSavedPackages(data);
        // setFilteredPackages(data);
      } catch (error) {
        console.error(
          "Failed to fetch saved packages. Using fallback data.",
          error
        );
        const savedIds = userData?.Profile?.saved || [];
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

  const handleDetailsClick = (pkgId) => {
    navigate(`/u/packages/details/${pkgId}`);
  };

  const getCampaignStatus = (pkgId) => {
    return savedPackages.find((pkg) => pkg.id === pkgId)?.campaignStatus;
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
            packages={filteredPackages}  // Guaranteed to be an array
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onDetailsClick={handleDetailsClick}
            getCampaignStatus={getCampaignStatus}
          />
        </div>
      )}
    </div>
  );
}

export default SavedPackages;
