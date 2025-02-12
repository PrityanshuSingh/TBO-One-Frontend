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
  const { userData, updateUserData } = useContext(AuthContext);
  const { campaigns } = useContext(CampaignContext);

  // Toggle mode state: "promptBased" or "suggestive"
  const [creationMode, setCreationMode] = useState("promptBased");

  // STATES FOR PROMPT BASED FLOW
  const [aiPackages, setAiPackages] = useState([]);
  const [isAiActive, setIsAiActive] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // New state for AI creation status
  const [currentAiStep, setCurrentAiStep] = useState("");
  const [aiSteps, setAiSteps] = useState([]);

  // Form states (unchanged)
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

  // Handler for Prompt Based AI search
  const handleAiSearch = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!aiPrompt.trim()) {
      setErrorMsg("Please provide a prompt.");
      return;
    }
    setIsAiLoading(true);
    setIsAiActive(false);

    // Reset current AI status step
    setCurrentAiStep("");

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
      agentId: userData?.id,
    };
    console.log("AI Search finalData =>", finalData);

    try {
      const res = await api.post("/api/ai/packages/generate", finalData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("AI Responsefor packages =>", res.data.package[0]);
      if (!Array.isArray(res.data.package)) {
        setAiPackages([res.data.package]);
      } else {
        // console.warn("Invalid AI data, using empty array for suggestions");
        console.log("AI Packages =>", res.data.package);
        setAiPackages(res.data.package);
      }

      const updatedPersonalized = res.data.personalized || [];
      console.log("Updated personalized packages:", updatedPersonalized);
      updateUserData((prev) => ({
        ...prev,
        Profile: { ...prev.Profile, personalized: updatedPersonalized },
      }));

      setIsAiActive(true);
    } catch (error) {
      console.error("AI prompt failed. Using local fallback.", error);
      setAiPackages([]);
      setIsAiActive(true);
    } finally {
      setIsAiLoading(false);
    }
  };

  console.log("updatedUserData:", userData);
  useEffect(() => {
    let timeoutId;
    if (isAiLoading) {
      // Define an array of steps with custom delays (in milliseconds)
      const stepsWithDelay = [
        { message: "Searching for relevant flights...", delay: 5000 },
        { message: "Looking for hotels...", delay: 5000 },
        { message: "Gathering sightseeing options...", delay: 5000 },
        { message: "Analyzing trends based on your preferences...", delay: 4000 },
        { message: "Creating a personalized package for you...", delay: 7000 },
        { message: "Optimizing travel itineraries...", delay: 4000 },
        { message: "Generating an image for your package...", delay: 15000 },
        { message: "It will be ready in a moment...Image Generation takes time", delay: 7000 },
      ];
      // Append a final step with no delay after it
      const steps = [
        ...stepsWithDelay,
        { message: "Publishing the package...", delay: 0 },
      ];
      
      let stepIndex = 0;
      const nextStep = () => {
        if (stepIndex < steps.length) {
          setCurrentAiStep(steps[stepIndex].message);
          const delay = steps[stepIndex].delay;
          stepIndex++;
          if (delay > 0) {
            timeoutId = setTimeout(nextStep, delay);
          }
        }
      };
      nextStep();
    } else {
      setCurrentAiStep("");
    }
    return () => clearTimeout(timeoutId);
  }, [isAiLoading]);
  
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
              <>
                <h1 className={styles.mainTitle}>
                  Generate Prompt Based AI Packages
                </h1>
                <p className={styles.subtitle}>
                  Create full personalized travel packages using just a prompt
                  and let the AI handle the rest.
                </p>
              </>
            ) : (
              <>
                <h1 className={styles.mainTitle}>
                  Build Packages with AI Suggestive Guidance
                </h1>
                <p className={styles.subtitle}>
                  Use AI suggestive guidance in every step to create
                  personalized travel packages.
                </p>
              </>
            )}
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
            {isAiLoading && (
              <div className={styles.aiStatusContainer}>
                <p>{currentAiStep}</p>
              </div>
            )}
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
                          key={pkg?.id}
                          id={pkg?.id}
                          packageTitle={pkg?.packageTitle}
                          image={pkg?.image}
                          location={pkg?.location}
                          duration={pkg?.duration}
                          price={pkg?.price?.totalPrice}
                          currency={pkg?.price?.currency}
                          campaignStatus={
                            campaigns &&
                            campaigns.find((c) => c.pkgId === pkg?.id)?.status
                          }
                          onDetailsClick={() => handleDetailsClick(pkg?.id)}
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
