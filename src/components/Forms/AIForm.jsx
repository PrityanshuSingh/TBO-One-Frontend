// src/components/Forms/AIForm.jsx
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import styles from "./styles/AIForm.module.scss";

const TBO_COUNTRYLIST_URL = import.meta.env.VITE_TBO_COUNTRYLIST_URL;
const TBO_CITYLIST_URL = import.meta.env.VITE_TBO_CITYLIST_URL;

function AIForm({
  // All the parent states + setters
  originCountry,
  setOriginCountry,
  originCountryCode,
  setOriginCountryCode,
  originCity,
  setOriginCity,
  originCityCode,
  setOriginCityCode,
  destinationCountry,
  setDestinationCountry,
  destinationCountryCode,
  setDestinationCountryCode,
  destinationCity,
  setDestinationCity,
  destinationCityCode,
  setDestinationCityCode,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  adultCount,
  setAdultCount,
  aiPrompt,
  setAiPrompt,

  // Handlers
  onSubmit,
  onReset,

  isAiActive,
  setIsAiActive,
  isAiLoading,
  errorMsg,
}) {
  const { userData } = useContext(AuthContext);

  // Reintroduce these states for country/city suggestions
  const [countries, setCountries] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);

  // Show/hide states for suggestions
  const [showOriginCountrySuggestions, setShowOriginCountrySuggestions] =
    useState(false);
  const [showOriginCitySuggestions, setShowOriginCitySuggestions] =
    useState(false);
  const [showDestCountrySuggestions, setShowDestCountrySuggestions] =
    useState(false);
  const [showDestCitySuggestions, setShowDestCitySuggestions] = useState(false);

  // On mount, fetch countries
  useEffect(() => {
    fetchCountries();
  }, []);

  // Retrieve stored or fallback credentials
  const getAuthCredentials = () => {
    const authSession = JSON.parse(
      sessionStorage.getItem("authSession") || "{}"
    );
    return {
      username: authSession.username || "hackathontest",
      password: authSession.password || "Hac@98910186",
    };
  };

  // Fetch all countries
  const fetchCountries = async () => {
    try {
      const { username, password } = getAuthCredentials();
      const encodedAuth = btoa(`${username}:${password}`);

      const response = await axios.get(TBO_COUNTRYLIST_URL, {
        headers: {
          Authorization: `Basic ${encodedAuth}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      setCountries(response.data.CountryList);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  // Fetch cities for a specific country
  const fetchCities = async (countryCode, setCitiesArray) => {
    try {
      const { username, password } = getAuthCredentials();
      const encodedAuth = btoa(`${username}:${password}`);

      const response = await axios.post(
        TBO_CITYLIST_URL,
        { CountryCode: countryCode },
        {
          headers: {
            Authorization: `Basic ${encodedAuth}`,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      setCitiesArray(response.data.CityList);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Filter a list by user input
  const filterSuggestions = (list, input) => {
    return list.filter((item) =>
      item.Name.toLowerCase().includes(input.toLowerCase())
    );
  };

  // For changing country input
  const handleCountryChange = (
    e,
    setCountryText,
    setCountryCode,
    setCitiesArray,
    setShowSuggestions
  ) => {
    const value = e.target.value;
    setCountryText(value);
    setCountryCode("");
    setShowSuggestions(value.trim() !== "");
  };

  // For changing city input
  const handleCityChange = (
    e,
    setCityText,
    setCityCode,
    setShowSuggestions
  ) => {
    const value = e.target.value;
    setCityText(value);
    setCityCode("");
    setShowSuggestions(value.trim() !== "");
  };

  // Selecting a country from suggestions
  const handleCountrySelect = (
    countryObj,
    setCountryText,
    setCountryCode,
    setCitiesArray,
    setShowSuggestions
  ) => {
    setCountryText(countryObj.Name);
    setCountryCode(countryObj.Code);
    setShowSuggestions(false);
    fetchCities(countryObj.Code, setCitiesArray);
  };

  // Selecting a city
  const handleCitySelect = (
    cityObj,
    setCityText,
    setCityCode,
    setShowSuggestions
  ) => {
    setCityText(cityObj.Name);
    setCityCode(cityObj.Code);
    setShowSuggestions(false);
  };

  // Form submit -> parent's onSubmit
  const handleLocalSubmit = async (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  // Reset form
  const handleResetClick = () => {
    setOriginCountry("");
    setOriginCity("");
    setDestinationCountry("");
    setDestinationCity("");
    setOriginCountryCode("");
    setOriginCityCode("");
    setDestinationCountryCode("");
    setDestinationCityCode("");
    setFromDate("");
    setToDate("");
    setAdultCount("1");
    setAiPrompt("");
    setIsAiActive(false);
    onReset?.(); // call parent's onReset if provided
  };

  return (
    <>
      <h2 className={styles.aiSearchTitle}>Generate Personalized Packages</h2>
      <div className={styles.aiSearchSection}>
        {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}

        <form className={styles.aiPromptForm} onSubmit={handleLocalSubmit}>
          {/* Origin Country */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Origin Country</label>
            <input
              type="text"
              value={originCountry}
              onChange={(e) =>
                handleCountryChange(
                  e,
                  setOriginCountry,
                  setOriginCountryCode,
                  setOriginCities,
                  setShowOriginCountrySuggestions
                )
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'United Kingdom'"
            />
            {showOriginCountrySuggestions && originCountry && (
              <ul className={styles.suggestionsList}>
                {filterSuggestions(countries, originCountry).map((c, i) => (
                  <li
                    key={i}
                    onClick={() =>
                      handleCountrySelect(
                        c,
                        setOriginCountry,
                        setOriginCountryCode,
                        setOriginCities,
                        setShowOriginCountrySuggestions
                      )
                    }
                  >
                    {c.Name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Origin City */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Origin City</label>
            <input
              type="text"
              value={originCity}
              onChange={(e) =>
                handleCityChange(
                  e,
                  setOriginCity,
                  setOriginCityCode,
                  setShowOriginCitySuggestions
                )
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'London'"
            />
            {showOriginCitySuggestions && originCity && (
              <ul className={styles.suggestionsList}>
                {filterSuggestions(originCities, originCity).map(
                  (cityObj, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        handleCitySelect(
                          cityObj,
                          setOriginCity,
                          setOriginCityCode,
                          setShowOriginCitySuggestions
                        )
                      }
                    >
                      {cityObj.Name}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Destination Country */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Destination Country</label>
            <input
              type="text"
              value={destinationCountry}
              onChange={(e) =>
                handleCountryChange(
                  e,
                  setDestinationCountry,
                  setDestinationCountryCode,
                  setDestinationCities,
                  setShowDestCountrySuggestions
                )
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'India'"
            />
            {showDestCountrySuggestions && destinationCountry && (
              <ul className={styles.suggestionsList}>
                {filterSuggestions(countries, destinationCountry).map(
                  (c, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        handleCountrySelect(
                          c,
                          setDestinationCountry,
                          setDestinationCountryCode,
                          setDestinationCities,
                          setShowDestCountrySuggestions
                        )
                      }
                    >
                      {c.Name}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* Destination City */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Destination City</label>
            <input
              type="text"
              value={destinationCity}
              onChange={(e) =>
                handleCityChange(
                  e,
                  setDestinationCity,
                  setDestinationCityCode,
                  setShowDestCitySuggestions
                )
              }
              className={styles.aiPromptInput}
              placeholder="e.g. 'Mumbai'"
            />
            {showDestCitySuggestions && destinationCity && (
              <ul className={styles.suggestionsList}>
                {filterSuggestions(destinationCities, destinationCity).map(
                  (cityObj, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        handleCitySelect(
                          cityObj,
                          setDestinationCity,
                          setDestinationCityCode,
                          setShowDestCitySuggestions
                        )
                      }
                    >
                      {cityObj.Name}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* From Date */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className={styles.aiPromptInput}
            />
          </div>

          {/* To Date */}
          <div className={styles.formRow}>
            <label className={styles.formLabel}>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className={styles.aiPromptInput}
            />
          </div>

          {/* Adults */}
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

          {/* Prompt */}
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
