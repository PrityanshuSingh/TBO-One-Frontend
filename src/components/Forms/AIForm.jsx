// src/components/Forms/AIForm.jsx

import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import styles from "./styles/AIForm.module.scss";

// TBO endpoints proxied
const TBO_COUNTRYLIST_URL =
  "/tbo/SharedServices/SharedData.svc/rest/CountryList";
const TBO_CITYLIST_URL =
  "/tbo/SharedServices/StaticData.svc/rest/GetDestinationSearchStaticData";

// Our custom hooks
import { useOriginCountryCity } from "../../hooks/useOriginCountryCity";
import { useDestinationCountryCity } from "../../hooks/useDestinationCountryCity";

function AIForm({
  aiPrompt,
  setAiPrompt,
  city,
  setCity,
  country,
  setCountry,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  adultCount,
  setAdultCount,
  onSubmit,
  isAiActive,
  errorMsg,
  setIsAiActive,
  setAiPackages,
  onReset,
}) {
  const { userData } = useContext(AuthContext);
  const tokenId = userData?.TokenId;
  const userIP = userData?.Profile?.ipAddress ?? "103.161.223.11";

  // Hook for origin
  const {
    originCountry,
    originCountrySuggestions,
    originCountryCode,
    originCitiesData,
    originCity,
    originCitySuggestions,
    originCityObj,
    handleOriginCountryChange,
    selectOriginCountry,
    handleOriginCityChange,
    selectOriginCity,
    resetOrigin,
  } = useOriginCountryCity(tokenId, userIP);

  // Hook for destination
  const {
    destinationCountry,
    destinationCountrySuggestions,
    destinationCountryCode,
    destinationCitiesData,
    destinationCity,
    destinationCitySuggestions,
    destinationCityObj,
    handleDestinationCountryChange,
    selectDestinationCountry,
    handleDestinationCityChange,
    selectDestinationCity,
    resetDestination,
  } = useDestinationCountryCity(tokenId, userIP);

  // Local "submit" that merges all data
  const handleLocalSubmit = async (e) => {
    e.preventDefault();

    // If you're also using the parent states "city","country", you could unify them.
    // But if you prefer your hook states, you might not need "city"/"country" from props anymore.

    const finalData = {
      // from the origin hook
      originCountry,
      originCountryCode,
      originCity,
      originCityObj,

      // from the destination hook
      destinationCountry,
      destinationCountryCode,
      destinationCity,
      destinationCityObj,

      // date/adults from props
      fromDate,
      toDate,
      adultCount,

      // prompt
      aiPrompt,
    };
    console.log("Sending AI form details =>", finalData);

    try {
      const res = await axios.post("/api/aiForm", finalData);
      console.log("Server response =>", res.data);
    } catch (err) {
      console.error("Error posting AI form =>", err);
    }
    onSubmit(e);
  };

  // Reset function that also resets hook states
  const handleResetClick = () => {
    resetOrigin();
    resetDestination();

    // If you're also using "country"/"city" from the parent:
    setCity("");
    setCountry("");

    setFromDate("");
    setToDate("");
    setAdultCount("1");
    setAiPrompt("");
    setIsAiActive(false);
    setAiPackages([]);
    onReset();
  };

  return (
    <>
      <h2 className={styles.aiSearchTitle}>Generate Personalized Packages</h2>
      <div className={styles.aiSearchSection}>
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

        <form className={styles.aiPromptForm} onSubmit={handleLocalSubmit}>
          {/* ORIGIN COUNTRY */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Origin Country</label>
            <input
              type="text"
              value={originCountry}
              onChange={(e) =>
                handleOriginCountryChange(e, TBO_COUNTRYLIST_URL, tokenId)
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'United Kingdom'"
            />
            {originCountrySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {originCountrySuggestions.map((c, i) => (
                  <li
                    key={i}
                    onClick={() =>
                      selectOriginCountry(c, TBO_CITYLIST_URL, tokenId)
                    }
                  >
                    <span style={{ fontSize: "0.85rem" }}>{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ORIGIN CITY */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Origin City</label>
            <input
              type="text"
              value={originCity}
              onChange={handleOriginCityChange}
              className={styles.aiPromptInput}
              placeholder="e.g. 'Delhi'"
            />
            {originCitySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {originCitySuggestions.map((obj, i) => (
                  <li key={i} onClick={() => selectOriginCity(obj)}>
                    <span style={{ fontSize: "0.85rem" }}>{obj.cityName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DESTINATION COUNTRY */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Destination Country</label>
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) =>
                handleDestinationCountryChange(e, TBO_COUNTRYLIST_URL, tokenId)
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'India'"
            />
            {destinationCountrySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {destinationCountrySuggestions.map((c, i) => (
                  <li
                    key={i}
                    onClick={() =>
                      selectDestinationCountry(c, TBO_CITYLIST_URL, tokenId)
                    }
                  >
                    <span style={{ fontSize: "0.85rem" }}>{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DESTINATION CITY */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Destination City</label>
            <input
              type="text"
              value={destinationCity}
              onChange={handleDestinationCityChange}
              className={styles.aiPromptInput}
              placeholder="e.g. 'Goa'"
            />
            {destinationCitySuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {destinationCitySuggestions.map((obj, i) => (
                  <li key={i} onClick={() => selectDestinationCity(obj)}>
                    <span style={{ fontSize: "0.85rem" }}>{obj.cityName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* FROM DATE */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={styles.aiPromptInput}
            />
          </div>

          {/* TO DATE */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={styles.aiPromptInput}
            />
          </div>

          {/* ADULTS */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Adults</label>
            <input
              type="number"
              min="1"
              value={adultCount}
              onChange={(e) => setAdultCount(e.target.value)}
              className={styles.aiPromptInput}
            />
          </div>

          {/* PROMPT */}
          <div className={styles.promptRow}>
            <label className={`${styles.formLabel} ${styles.promptLabel}`}>
              Prompt
            </label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'luxury beach honeymoon'"
              className={styles.promptInput}
            />
          </div>

          {/* SUBMIT & RESET */}
          <button type="submit" className={styles.aiPromptButton}>
            {isAiActive ? "Regenerate AI" : "Search AI"}
          </button>

          {isAiActive && (
            <button
              type="button"
              className={styles.resetButton}
              onClick={handleResetClick}
            >
              Reset
            </button>
          )}
        </form>
      </div>
    </>
  );
}

export default AIForm;
