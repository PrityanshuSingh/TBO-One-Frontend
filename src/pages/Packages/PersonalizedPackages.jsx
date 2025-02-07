import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";
import CategorySection from "../../components/Sections/PackageCategory/CategorySection";
import { FaArrowLeft } from "react-icons/fa";
import Load from "../../microInteraction/Load/Load";
import styles from "./styles/PersonalizedPackages.module.scss";

function PeronalizedPackages() {
  const { userData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);
  const navigate = useNavigate();
  const userEmail = userData?.Profile?.email;

  // State for personalized packages
  const [personalizedPackages, setPersonalizedPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState(""); // Category search filter

  // Fetch personalized packages from API
  useEffect(() => {
    const fetchPersonlizedPackages = async () => {
      if (!userEmail) return;

      try {
        const res = await api.get("/api/packages/personlized", {
          params: { email: userEmail },
        });

        if (Array.isArray(res.data) && res.data.length > 0) {
          setPersonalizedPackages(res.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch personalized packages. Using fallback data.",
          error
        );
        const personalizedIds = userData?.Profile?.personalized || [];
        console.log("Personalized IDs:", personalizedIds);
        const fallbackData = localPackages.filter((pkg) =>
          personalizedIds.includes(pkg.id)
        );
        setPersonalizedPackages(fallbackData);
        setFilteredPackages(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonlizedPackages();
  }, [userEmail, userData]);

  // Filter packages when filterValue changes
  useEffect(() => {
    if (!filterValue.trim()) {
      setFilteredPackages(personalizedPackages);
    } else {
      const filtered = personalizedPackages.filter((pkg) =>
        (pkg.packageTitle + " " + pkg.location)
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
  }, [filterValue, personalizedPackages]);

  const getCampaignStatus = (pkgId) => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null;
    const foundCampaign = campaigns.find((c) => c.pkgId === pkgId);
    return foundCampaign ? foundCampaign.status : null;
  };

  console.log("Personalized Packages:", personalizedPackages);
  return (
    <div className={styles.personalizedContainer}>
      <div className={styles.headerRow}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft size={18} />
        </button>
        <h2 className={styles.title}>My Personalized Package Vault</h2>
      </div>

      {loading ? (
        <Load />
      ) : filteredPackages.length === 0 ? (
        <p className={styles.noSavedMsg}>No matching personalized packages found.</p>
      ) : (
        <div className={styles.categorySection}>
          <CategorySection
            tag="Personalized"
            packages={filteredPackages}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            onDetailsClick={(pkgId) => navigate(`/u/packages/details/${pkgId}`)}
            getCampaignStatus={getCampaignStatus}
          />
        </div>
      )}
    </div>
  );
}

export default PeronalizedPackages;
