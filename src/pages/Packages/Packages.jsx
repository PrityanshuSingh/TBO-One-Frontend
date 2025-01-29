import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";

import CampaignFilter from "../../components/Filters/CampaignFilter";
import AIForm from "../../components/Forms/AIForm";
import CategorySection from "../../components/Sections/CategorySection";

import { FaRegBookmark } from "react-icons/fa";

import styles from "./styles/Packages.module.scss";

const PRIORITY_TAGS = [
  "Trending",
  "Adventure",
  "Cultural",
  "Honeymoon",
  "History",
  "Beach",
  "Spa",
  "Pop Culture",
  "Foodie",
  "City Tour",
  "Shopping",
  "K-Pop",
];

function categorizePackages(allPackages) {
  const categories = {};
  PRIORITY_TAGS.forEach((tag) => {
    categories[tag] = [];
  });
  allPackages.forEach((pkg) => {
    const matchedTag = (pkg.recommendationTags || []).find((t) =>
      PRIORITY_TAGS.includes(t)
    );
    if (matchedTag) {
      categories[matchedTag].push(pkg);
    }
  });
  return categories;
}

const Packages = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);
  console.log("Campaigns from CampaignContext:", campaigns);

  const [packagesData, setPackagesData] = useState([]);
  const [categories, setCategories] = useState({});

  const [aiPackages, setAiPackages] = useState([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [campaignFilter, setCampaignFilter] = useState("ALL");

  const [categoryFilters, setCategoryFilters] = useState(
    PRIORITY_TAGS.reduce((acc, tag) => ({ ...acc, [tag]: "" }), {})
  );

  const [aiPrompt, setAiPrompt] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adultCount, setAdultCount] = useState("1");

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await axios.get("/api/packages");
        setPackagesData(res.data);
      } catch (error) {
        console.error("Failed to fetch from API. Using local fallback.", error);
        setPackagesData(localPackages);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    setCategories(categorizePackages(packagesData));
  }, [packagesData]);

  const getCampaignStatus = (pkgId) => {
    if (!campaigns || campaigns.length === 0) return null;
    const foundCampaign = campaigns.find((campaign) => campaign.pkgId === pkgId);
    return foundCampaign ? foundCampaign.status : null;
  };

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

  const validateAiForm = () => {
    if (!aiPrompt.trim()) {
      return "Please provide a prompt.";
    }
    return "";
  };

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
    console.log("AI search formData = ", formData);

    try {
      const res = await axios.post("/api/ai/packages", formData);
      setAiPackages(res.data);
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
              Top Travel Packages Curated for you
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
                    <TravelCard
                      key={pkg.id}
                      id={pkg.id}
                      packageTitle={pkg.packageTitle}
                      image={pkg.image}
                      location={pkg.location}
                      duration={pkg.duration}
                      price={pkg.price}
                      priceColor={pkg.priceColor}
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