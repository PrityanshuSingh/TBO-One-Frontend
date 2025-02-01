// src/pages/Packages/Packages.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";

import CampaignFilter from "../../components/Filters/CampaignFilter";
import AIForm from "../../components/Forms/AIForm";
import CategorySection from "../../components/Sections/PackageCategory/CategorySection";
import PackageCard from "../.././components/Cards/PackageCard";

import { FaRegBookmark } from "react-icons/fa";

import styles from "./styles/Packages.module.scss";

/**
 * Priority tags that we want to display as categories.
 */
const PRIORITY_TAGS = [
  "Trending",
  "Cultural",
  "Heritage",
  "Royal",
  "Adventure",
  "Shopping",
  "Scenic",
  "Relaxation",
  "Backwaters",
  "History",
  "Beach",
  "Spa",
  "Nightlife",
  "Water Sports",
  "Pop Culture",
  "Foodie",
  "City Tour",
  "Shopping",
  "K-Pop",
];

/**
 * Categorizes an array of packages into a record keyed by tags from PRIORITY_TAGS.
 * @param {Array} allPackages
 * @returns {Object} categories where keys are tags and values are arrays of packages
 */
function categorizePackages(allPackages) {
  const categories = {};
  PRIORITY_TAGS.forEach((tag) => {
    categories[tag] = [];
  });

  if (Array.isArray(allPackages) && allPackages.length > 0) {
    allPackages.forEach((pkg) => {
      const matchedTags = (pkg.recommendationTags || [])
        .filter((t) => PRIORITY_TAGS.includes(t))
        .slice(0, 3); // Get first 3 matching tags

      matchedTags.forEach((tag) => {
        categories[tag].push(pkg);
      });
    });
  } else {
    console.warn("categorizePackages => Invalid or empty packages data");
  }

  return categories;
}

const Packages = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);

  console.log("Campaigns:", campaigns);
  const [packagesData, setPackagesData] = useState([]);
  const [categories, setCategories] = useState({});

  // States for AI form
  const [aiPackages, setAiPackages] = useState([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adultCount, setAdultCount] = useState("1");

  // States for campaign filter
  const [campaignFilter, setCampaignFilter] = useState("ALL");

  // Category-based search states
  const [categoryFilters, setCategoryFilters] = useState(
    PRIORITY_TAGS.reduce((acc, tag) => ({ ...acc, [tag]: "" }), {})
  );

  // Fetch initial packages
  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await api.get("/api/packages");
        // Validate the data before setting to state
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPackagesData(res.data);
        } else {
          console.warn("Invalid data from /api/packages, using fallback");
          setPackagesData(localPackages);
        }
      } catch (error) {
        console.error("Failed to fetch from API. Using local fallback.", error);
        setPackagesData(localPackages);
      }
    }
    fetchPackages();
  }, []);

  // Categorize packages whenever packagesData changes
  useEffect(() => {
    setCategories(categorizePackages(packagesData));
  }, [packagesData]);

  
  /**
   * Returns the campaign status for a specific package ID, or null if none found.
   * @param {string|number} pkgId
   * @returns {string|null} e.g., "ACTIVE", "ENDED", or null
   */
  const getCampaignStatus = (pkgId) => {
    if (!Array.isArray(campaigns) || campaigns.length === 0) return null;
    // console.log("getCampaignStatus => pkgId:", pkgId);
    // console.log("getCampaigns:", campaigns);
    const foundCampaign = campaigns.find((c) => c.pkgId == pkgId);
    return foundCampaign ? foundCampaign.status : null;
  };

  /**
   * Checks whether a package matches the category filter text
   * and the currently selected campaign filter (if any).
   * @param {Object} pkg - The package to filter.
   * @param {string} tag - The category tag used as a filter key.
   */
  const filterPackage = (pkg, tag) => {
    const text = (pkg.packageTitle + pkg.location).toLowerCase();
    if (!text.includes(categoryFilters[tag].toLowerCase())) return false;
    if (campaignFilter !== "ALL") {
      const status = getCampaignStatus(pkg.id);
      if (status !== campaignFilter) return false;
    }
    return true;
  };

  const handleDetailsClick = (pkgId) => {
    navigate(`/u/packages/details/${pkgId}`);
  };

  // Validate required fields for the AI form
  const validateAiForm = () => {
    if (!aiPrompt.trim()) {
      return "Please provide a prompt.";
    }
    return "";
  };

  // AI prompt submission
  const handleAiSearch = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validateAiForm();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setIsAiLoading(true);
    setIsAiActive(false);

    const formData = {
      prompt: aiPrompt,
      city,
      country,
      fromDate,
      toDate,
      adultCount,
    };

    try {
      const res = await api.post("/api/ai/packages", formData);
      if (Array.isArray(res.data)) {
        setAiPackages(res.data);
      } else {
        console.warn("Invalid AI data, using empty array for suggestions");
        setAiPackages([]);
      }
      setIsAiActive(true);
    } catch (error) {
      console.error("AI prompt failed. Using local fallback.", error);
      setAiPackages([]);
      setIsAiActive(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSavedRoute = () => {
    navigate("/u/packages/saved");
  };

  return (
    <div className={styles.packagesContainer}>
      <div className={styles.fixedHeader}>
        <div className={styles.topBar}>
          <div className={styles.headingArea}>
            <h1 className={styles.mainTitle}>AI-Powered Packages</h1>
            <p className={styles.subtitle}>
              Top Travel Packages Curated for You
            </p>
          </div>
          <div className={styles.rightActions}>
            <CampaignFilter
              campaignFilter={campaignFilter}
              onChange={setCampaignFilter}
            />
            <button
              className={styles.savedBtn}
              onClick={handleSavedRoute}
              title="View Saved Packages"
            >
              <FaRegBookmark size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.scrollContent}>
        <AIForm
          aiPrompt={aiPrompt}
          setAiPrompt={setAiPrompt}
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          adultCount={adultCount}
          setAdultCount={setAdultCount}
          onSubmit={handleAiSearch}
          isAiActive={isAiActive}
          setIsAiActive={setIsAiActive}
          isAiLoading={isAiLoading}
          errorMsg={errorMsg}
        />

        {isAiActive ? (
          <div className={styles.aiSuggestionSection}>
            <h2 className={styles.categoryTitle}>AI Suggested Packages</h2>
            <div className={styles.categoryContainer}>
              {aiPackages.length === 0 ? (
                <div className={styles.noPackagesMsg}>
                  No suggested packages found.
                </div>
              ) : (
                <div className={styles.cardsGrid}>
                  {aiPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      id={pkg.id}
                      packageTitle={pkg.packageTitle}
                      image={pkg.image}
                      location={pkg.location}
                      duration={pkg.duration}
                      price={pkg.price.totalPrice}
                      currency={pkg.price.currency}
                      campaignStatus={getCampaignStatus(pkg.id)}
                      onDetailsClick={() => handleDetailsClick(pkg.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          PRIORITY_TAGS.map((tag) => {
            const catPackages = categories[tag] || [];
            if (catPackages.length === 0) return null;
            const filtered = catPackages.filter((pkg) =>
              filterPackage(pkg, tag)
            );
            return (
              <CategorySection
                key={tag}
                tag={tag}
                packages={filtered}
                filterValue={categoryFilters[tag]}
                setFilterValue={(val) =>
                  setCategoryFilters((prev) => ({ ...prev, [tag]: val }))
                }
                onDetailsClick={handleDetailsClick}
                getCampaignStatus={getCampaignStatus}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Packages;
