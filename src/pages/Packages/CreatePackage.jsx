// src/pages/Packages/Packages.jsx

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

import { CampaignContext } from "../../context/CampaignContext";
import { AuthContext } from "../../context/AuthContext";
import localPackages from "../../data/localPackages.json";

import AIForm from "../../components/Forms/AIForm";
import SuggestiveForm from "../../components/Forms/SuggestiveForm"; // New component
import PackageCard from "../../components/Cards/PackageCard";

import { FaRegBookmark } from "react-icons/fa";
import { LuPackageOpen } from "react-icons/lu";

import styles from "./styles/CreatePackage.module.scss";

const CreatePackage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);

  // Toggle mode state: "promptBased" or "suggestive"
  const [creationMode, setCreationMode] = useState("promptBased");

  // STATES FOR PROMPT BASED FLOW (existing)
  const [aiPackages, setAiPackages] = useState([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [originCountry, setOriginCountry] = useState("");
  const [originCountryCode, setOriginCountryCode] = useState("");
  const [originCity, setOriginCity] = useState("");
  const [originCityCode, setOriginCityCode] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationCountryCode, setDestinationCountryCode] = useState("");
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationCityCode, setDestinationCityCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [adultCount, setAdultCount] = useState("1");
  const [aiPrompt, setAiPrompt] = useState("");

  // Handler for Prompt Based AI search (remains unchanged)
  const handleAiSearch = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!aiPrompt.trim()) {
      setErrorMsg("Please provide a prompt.");
      return;
    }
    setIsAiLoading(true);
    setIsAiActive(false);

    const finalData = {
      originCountry,
      originCountryCode,
      originCity,
      originCityCode,
      destinationCountry,
      destinationCountryCode,
      destinationCity,
      destinationCityCode,
      fromDate,
      toDate,
      adultCount,
      aiPrompt,
    };
    console.log("AI Search finalData =>", finalData);

    try {
      const res = await api.post("/api/ai/packages/generate", finalData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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

  // Handler for final submission of the suggestive package (data received from SuggestiveForm)
  const handleSuggestiveSubmit = async (suggestiveData) => {
    console.log("Final Suggestive Package Data =>", suggestiveData);
    try {
      // POST the finalized package to the backend
      const res = await api.post("/api/packages/finalize", suggestiveData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Navigate or display success message after saving
      navigate(`/u/packages/details/${res.data.packageId}`);
    } catch (error) {
      console.error("Finalizing package failed.", error);
    }
  };

  const handleSavedRoute = () => {
    navigate("/u/packages/saved");
  };

  const handlePersonalizedRoute = () => {
    navigate("/u/packages/personalized");
  };

  const handleDetailsClick = (pkgId) => {
    navigate(`/u/packages/details/${pkgId}`);
  };

  return (
    <div className={styles.packagesContainer}>
      <div className={styles.fixedHeader}>
        <div className={styles.topBar}>
          <div className={styles.headingArea}>
            {creationMode === "promptBased" ? (
              <h1 className={styles.mainTitle}>
                Generate Prompt Based AI Personalized Packages
              </h1>
            ) : (
              <h1 className={styles.mainTitle}>
                Build with AI Suggestive Guidance
              </h1>
            )}
            <p className={styles.subtitle}>
              Curate and customize travel packages for your customers using AI suggestions.
            </p>
          </div>
          <div className={styles.rightActions}>
            <div className={styles.modeToggle}>
              <button
                className={`${styles.toggleBtn} ${
                  creationMode === "promptBased" ? styles.activeToggle : ""
                }`}
                onClick={() => setCreationMode("promptBased")}
              >
                Prompt Based
              </button>
              <button
                className={`${styles.toggleBtn} ${
                  creationMode === "suggestive" ? styles.activeToggle : ""
                }`}
                onClick={() => setCreationMode("suggestive")}
              >
                Suggestive
              </button>
            </div>
            <button
              className={styles.savedBtn}
              onClick={handlePersonalizedRoute}
              title="View Personalized Packages"
            >
              <LuPackageOpen size={22} />
            </button>
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
        {creationMode === "promptBased" ? (
          <>
            <AIForm
              originCountry={originCountry}
              setOriginCountry={setOriginCountry}
              originCountryCode={originCountryCode}
              setOriginCountryCode={setOriginCountryCode}
              originCity={originCity}
              setOriginCity={setOriginCity}
              originCityCode={originCityCode}
              setOriginCityCode={setOriginCityCode}
              destinationCountry={destinationCountry}
              setDestinationCountry={setDestinationCountry}
              destinationCountryCode={destinationCountryCode}
              setDestinationCountryCode={setDestinationCountryCode}
              destinationCity={destinationCity}
              setDestinationCity={setDestinationCity}
              destinationCityCode={destinationCityCode}
              setDestinationCityCode={setDestinationCityCode}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              adultCount={adultCount}
              setAdultCount={setAdultCount}
              aiPrompt={aiPrompt}
              setAiPrompt={setAiPrompt}
              onSubmit={handleAiSearch}
              isAiActive={isAiActive}
              setIsAiActive={setIsAiActive}
              isAiLoading={isAiLoading}
              errorMsg={errorMsg}
            />

            {isAiActive && (
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
                          campaignStatus={
                            campaigns &&
                            campaigns.find((c) => c.pkgId === pkg.id)?.status
                          }
                          onDetailsClick={() => handleDetailsClick(pkg.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Render SuggestiveForm for the suggestive flow
          <SuggestiveForm
            originCountry={originCountry}
            setOriginCountry={setOriginCountry}
            originCountryCode={originCountryCode}
            setOriginCountryCode={setOriginCountryCode}
            originCity={originCity}
            setOriginCity={setOriginCity}
            originCityCode={originCityCode}
            setOriginCityCode={setOriginCityCode}
            destinationCountry={destinationCountry}
            setDestinationCountry={setDestinationCountry}
            destinationCountryCode={destinationCountryCode}
            setDestinationCountryCode={setDestinationCountryCode}
            destinationCity={destinationCity}
            setDestinationCity={setDestinationCity}
            destinationCityCode={destinationCityCode}
            setDestinationCityCode={setDestinationCityCode}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            adultCount={adultCount}
            setAdultCount={setAdultCount}
            onSubmit={handleSuggestiveSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePackage;
