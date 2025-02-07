
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./styles/SuggestiveForm.module.scss";

const TBO_COUNTRYLIST_URL = import.meta.env.VITE_TBO_COUNTRYLIST_URL;
const TBO_CITYLIST_URL = import.meta.env.VITE_TBO_CITYLIST_URL;

function SuggestiveForm({
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
  onSubmit,
}) {
  // States for origin/destination suggestions
  const [countries, setCountries] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [showOriginCountrySuggestions, setShowOriginCountrySuggestions] = useState(false);
  const [showOriginCitySuggestions, setShowOriginCitySuggestions] = useState(false);
  const [showDestCountrySuggestions, setShowDestCountrySuggestions] = useState(false);
  const [showDestCitySuggestions, setShowDestCitySuggestions] = useState(false);

  // States for flight, hotel, and sightseeing selections
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightSuggestions, setFlightSuggestions] = useState([]);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [flightPreference, setFlightPreference] = useState("");

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelSuggestions, setHotelSuggestions] = useState([]);
  const [isHotelLoading, setIsHotelLoading] = useState(false);
  const [hotelPreference, setHotelPreference] = useState("");

  const [selectedSightseeing, setSelectedSightseeing] = useState(null);
  const [sightseeingSuggestions, setSightseeingSuggestions] = useState([]);
  const [isSightseeingLoading, setIsSightseeingLoading] = useState(false);
  const [sightseeingPreference, setSightseeingPreference] = useState("");

  const [errorMsg, setErrorMsg] = useState("");

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  const getAuthCredentials = () => {
    const authSession = JSON.parse(sessionStorage.getItem("authSession") || "{}");
    return {
      username: authSession.username || "hackathontest",
      password: authSession.password || "Hac@98910186",
    };
  };

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

  const filterSuggestions = (list, input) => {
    return list.filter((item) =>
      item.Name.toLowerCase().includes(input.toLowerCase())
    );
  };

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

  const handleCityChange = (e, setCityText, setCityCode, setShowSuggestions) => {
    const value = e.target.value;
    setCityText(value);
    setCityCode("");
    setShowSuggestions(value.trim() !== "");
  };

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

  // Flight search handler (triggered after origin/destination and dates are set)
  const handleSearchFlights = async () => {
    if (!originCityCode || !destinationCityCode || !fromDate || !toDate) {
      setErrorMsg("Please fill in origin/destination details and dates.");
      return;
    }
    setErrorMsg("");
    setIsFlightLoading(true);
    try {
      const response = await axios.post("/api/ai/packages/flights", {
        originCityCode,
        destinationCityCode,
        fromDate,
        toDate,
      });
      if (Array.isArray(response.data)) {
        setFlightSuggestions(response.data);
      } else {
        setFlightSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching flights:", err);
      setFlightSuggestions([]);
    } finally {
      setIsFlightLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setFlightPreference(flight.airline);
    // After selecting flight, automatically search for hotels
    handleSearchHotels();
  };

  // Hotel search handler (triggered after flight selection)
  const handleSearchHotels = async () => {
    if (!destinationCountryCode || !destinationCity.trim()) {
      setErrorMsg("Please select destination country and city first.");
      return;
    }
    setErrorMsg("");
    setIsHotelLoading(true);
    try {
      const response = await axios.post("/api/ai/packages/hotels", {
        destinationCountryCode,
        destinationCity,
      });
      if (Array.isArray(response.data)) {
        setHotelSuggestions(response.data);
      } else {
        setHotelSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setHotelSuggestions([]);
    } finally {
      setIsHotelLoading(false);
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
    setHotelPreference(hotel.name);
    // After selecting hotel, automatically search for sightseeing options
    handleSearchSightseeing();
  };

  // Sightseeing search handler (triggered after hotel selection)
  const handleSearchSightseeing = async () => {
    if (!destinationCity.trim()) {
      setErrorMsg("Please select destination city.");
      return;
    }
    setErrorMsg("");
    setIsSightseeingLoading(true);
    try {
      const response = await axios.post("/api/ai/packages/sightseeing", {
        destinationCity,
      });
      if (Array.isArray(response.data)) {
        setSightseeingSuggestions(response.data);
      } else {
        setSightseeingSuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching sightseeing options:", err);
      setSightseeingSuggestions([]);
    } finally {
      setIsSightseeingLoading(false);
    }
  };

  const handleSelectSightseeing = (sight) => {
    setSelectedSightseeing(sight);
    setSightseeingPreference(sight.title);
  };

  // Final submission: Bundle all data and pass to parent's onSubmit handler
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const suggestiveData = {
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
      flightPreference: selectedFlight ? selectedFlight.airline : flightPreference,
      hotelPreference: selectedHotel ? selectedHotel.name : hotelPreference,
      sightseeingPreference: selectedSightseeing ? selectedSightseeing.title : sightseeingPreference,
    };
    onSubmit(suggestiveData);
  };

  return (
    <>
      <h2 className={styles.aiSearchTitle}>Suggestive Package Setup</h2>
           <div className={styles.aiSearchSection}>
              {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      
      <form className={styles.aiPromptForm} onSubmit={handleFinalSubmit}>
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
            placeholder="e.g. India"
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
            placeholder="e.g. New Delhi"
          />
          {showOriginCitySuggestions && originCity && (
            <ul className={styles.suggestionsList}>
              {filterSuggestions(originCities, originCity).map((cityObj, i) => (
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
              ))}
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
            placeholder="e.g. India"
          />
          {showDestCountrySuggestions && destinationCountry && (
            <ul className={styles.suggestionsList}>
              {filterSuggestions(countries, destinationCountry).map((c, i) => (
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
              ))}
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
            placeholder="e.g. Mumbai"
          />
          {showDestCitySuggestions && destinationCity && (
            <ul className={styles.suggestionsList}>
              {filterSuggestions(destinationCities, destinationCity).map((cityObj, i) => (
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
              ))}
            </ul>
          )}
        </div>

        {/* Dates and Adults */}
        <div className={styles.formRow}>
          <label className={styles.formLabel}>From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className={styles.aiPromptInput}
          />
        </div>
        <div className={styles.formRow}>
          <label className={styles.formLabel}>To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className={styles.aiPromptInput}
          />
        </div>
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

        {/* Flight Suggestions Section */}
        <div className={styles.formRow}>
          <button type="button" onClick={handleSearchFlights} className={styles.aiPromptButton}>
            Search Flights
          </button>
          {isFlightLoading && <p>Loading flights...</p>}
          {flightSuggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {flightSuggestions.map((flight, index) => (
                <li key={index} onClick={() => handleSelectFlight(flight)}>
                  {flight.airline} - {flight.flightNumber}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Hotel Suggestions Section (after flight selection) */}
        {selectedFlight && (
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Hotel Preference</label>
            <input
              type="text"
              value={hotelPreference}
              onChange={(e) => setHotelPreference(e.target.value)}
              placeholder="Enter hotel criteria..."
              className={styles.aiPromptInput}
            />
            <button type="button" onClick={handleSearchHotels} className={styles.aiPromptButton}>
              Search Hotels
            </button>
            {isHotelLoading && <p>Loading hotels...</p>}
            {hotelSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {hotelSuggestions.map((hotel, index) => (
                  <li key={index} onClick={() => handleSelectHotel(hotel)}>
                    {hotel.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Sightseeing Suggestions Section (after hotel selection) */}
        {selectedHotel && (
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Sightseeing Preference</label>
            <input
              type="text"
              value={sightseeingPreference}
              onChange={(e) => setSightseeingPreference(e.target.value)}
              placeholder="Enter sightseeing preference..."
              className={styles.aiPromptInput}
            />
            <button type="button" onClick={handleSearchSightseeing} className={styles.aiPromptButton}>
              Search Sightseeing
            </button>
            {isSightseeingLoading && <p>Loading sightseeing options...</p>}
            {sightseeingSuggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {sightseeingSuggestions.map((sight, index) => (
                  <li key={index} onClick={() => handleSelectSightseeing(sight)}>
                    {sight.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button type="submit" className={styles.aiPromptButton}>
          Save Package
        </button>
      </form>
      </div>
    </>
  );
}

export default SuggestiveForm;
