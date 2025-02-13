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
  // States for suggestion lists (for common fields)
  const [countries, setCountries] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [showOriginCountrySuggestions, setShowOriginCountrySuggestions] = useState(false);
  const [showOriginCitySuggestions, setShowOriginCitySuggestions] = useState(false);
  const [showDestCountrySuggestions, setShowDestCountrySuggestions] = useState(false);
  const [showDestCitySuggestions, setShowDestCitySuggestions] = useState(false);

  // States for selected suggestions
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightPreference, setFlightPreference] = useState("");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelPreference, setHotelPreference] = useState("");
  const [selectedSightseeing, setSelectedSightseeing] = useState(null);
  const [sightseeingPreference, setSightseeingPreference] = useState("");

  // Prompt states for each category
  const [flightPrompt, setFlightPrompt] = useState("");
  const [hotelPrompt, setHotelPrompt] = useState("");
  const [sightseeingPrompt, setSightseeingPrompt] = useState("");

  // Separate clip selection states (now arrays for multiple selections)
  const [selectedFlightClips, setSelectedFlightClips] = useState([]);
  const [selectedHotelClips, setSelectedHotelClips] = useState([]);
  const [selectedSightseeingClips, setSelectedSightseeingClips] = useState([]);

  // Hardcoded predefined suggestions – these serve both as clip data and as default search results.
  // const predefinedFlightSuggestions = [
  //   { airline: "Air India", flightNumber: "AI101" },
  //   { airline: "Indigo", flightNumber: "6E202" },
  //   { airline: "SpiceJet", flightNumber: "SG303" },
  // ];
  // const predefinedHotelSuggestions = [
  //   { name: "The Oberoi" },
  //   { name: "Taj Mahal Palace" },
  //   { name: "ITC Grand Chola" },
  // ];
  // const predefinedSightseeingSuggestions = [
  //   { title: "Heritage Walk" },
  //   { title: "City Tour" },
  //   { title: "Cultural Show" },
  // ];

  // // These are used to display filtered search results.
  // const [flightResults, setFlightResults] = useState(predefinedFlightSuggestions);
  // const [hotelResults, setHotelResults] = useState(predefinedHotelSuggestions);
  // const [sightseeingResults, setSightseeingResults] = useState(predefinedSightseeingSuggestions);

  // Hardcoded clip arrays (for user to select from) – expanded options.
  const flightClips = ["Air India", "Indigo", "SpiceJet", "Vistara", "GoAir"];
  const hotelClips = ["The Oberoi", "Taj Mahal Palace", "ITC Grand Chola", "Le Meridien", "Marriott"];
  const sightseeingClips = ["Heritage Walk", "City Tour", "Cultural Show", "River Cruise", "Food Tour"];

  const [errorMsg, setErrorMsg] = useState("");

  // Fetch the list of countries on mount
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

  // Filter suggestions for country/city fields
  const filterSuggestions = (list, input) => {
    return list.filter((item) =>
      item.Name.toLowerCase().includes(input.toLowerCase())
    );
  };

  // Handlers for common field changes and selections
  const handleCountryChange = (e, setCountryText, setCountryCode, setCitiesArray, setShowSuggestions) => {
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

  const handleCountrySelect = (countryObj, setCountryText, setCountryCode, setCitiesArray, setShowSuggestions) => {
    setCountryText(countryObj.Name);
    setCountryCode(countryObj.Code);
    setShowSuggestions(false);
    fetchCities(countryObj.Code, setCitiesArray);
  };

  const handleCitySelect = (cityObj, setCityText, setCityCode, setShowSuggestions) => {
    setCityText(cityObj.Name);
    setCityCode(cityObj.Code);
    setShowSuggestions(false);
  };

  // --- Toggle functions for clip selections (multiple selectable) ---
  const toggleFlightClip = (clip) => {
    setSelectedFlightClips((prevClips) =>
      prevClips.includes(clip)
        ? prevClips.filter((c) => c !== clip)
        : [...prevClips, clip]
    );
  };

  const toggleHotelClip = (clip) => {
    setSelectedHotelClips((prevClips) =>
      prevClips.includes(clip)
        ? prevClips.filter((c) => c !== clip)
        : [...prevClips, clip]
    );
  };

  const toggleSightseeingClip = (clip) => {
    setSelectedSightseeingClips((prevClips) =>
      prevClips.includes(clip)
        ? prevClips.filter((c) => c !== clip)
        : [...prevClips, clip]
    );
  };

  // --- Search functions for each category based on prompt and selected clips ---
  const searchFlights = () => {
    const clipQuery = selectedFlightClips.join(" ");
    const query = (flightPrompt + " " + clipQuery).trim();
    const results = predefinedFlightSuggestions.filter((flight) =>
      flight.airline.toLowerCase().includes(query.toLowerCase())
    );
    setFlightResults(results);
  };

  const searchHotels = () => {
    const clipQuery = selectedHotelClips.join(" ");
    const query = (hotelPrompt + " " + clipQuery).trim();
    const results = predefinedHotelSuggestions.filter((hotel) =>
      hotel.name.toLowerCase().includes(query.toLowerCase())
    );
    setHotelResults(results);
  };

  const searchSightseeing = () => {
    const clipQuery = selectedSightseeingClips.join(" ");
    const query = (sightseeingPrompt + " " + clipQuery).trim();
    const results = predefinedSightseeingSuggestions.filter((sight) =>
      sight.title.toLowerCase().includes(query.toLowerCase())
    );
    setSightseeingResults(results);
  };

  // Final Package Submission handler
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
      {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
      <form onSubmit={handleFinalSubmit}>
        {/* Common Details Section */}
        <div className={styles.section}>
          <h3>Common Details</h3>
          <div className={styles.aiPromptForm}>
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
            {/* Children */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>Children</label>
              <input
                type="number"
                min="0"
                value={0}
                className={styles.aiPromptInput}
                disabled
              />
              </div>

           </div>
        </div>

        {/* Flight Suggestions Section */}
        <div className={styles.section}>
          <h3>Flight Suggestions</h3>
          {/* Predefined Clip Buttons */}
          <div className={styles.clipsContainer}>
            {flightClips.map((clip, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.clipButton}
                onClick={() => toggleFlightClip(clip)}
              >
                {clip}
              </button>
            ))}
          </div>
          <div className={styles.promptRow}>
            <input
              type="text"
              value={flightPrompt}
              onChange={(e) => setFlightPrompt(e.target.value)}
              placeholder="Enter flight preference prompt"
              className={styles.aiPromptInput}
            />
            <button type="button" onClick={searchFlights} className={styles.aiPromptButton}>
              Search Flights
            </button>
          </div>
          
          {/* Show selected flight clips */}
          {selectedFlightClips.length > 0 && (
            <div className={styles.selectedClips}>
              {selectedFlightClips.map((clip, idx) => (
                <span key={idx} className={styles.selectedClip}>
                  {clip}
                </span>
              ))}
            </div>
          )}
          {/* <ul className={styles.suggestionsList}>
            {flightResults.length > 0 ? (
              flightResults.map((flight, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedFlight(flight);
                    setFlightPreference(flight.airline);
                  }}
                >
                  {flight.airline} - {flight.flightNumber}
                </li>
              ))
            ) : (
              <li>No flight suggestions found.</li>
            )}
          </ul>*/}
        </div>

        {/* Hotel Suggestions Section */}
        <div className={styles.section}>
          <h3>Hotel Suggestions</h3>
          {/* Predefined Clip Buttons */}
          <div className={styles.clipsContainer}>
            {hotelClips.map((clip, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.clipButton}
                onClick={() => toggleHotelClip(clip)}
              >
                {clip}
              </button>
            ))}
          </div>
          <div className={styles.promptRow}>
            <input
              type="text"
              value={hotelPrompt}
              onChange={(e) => setHotelPrompt(e.target.value)}
              placeholder="Enter hotel preference prompt"
              className={styles.aiPromptInput}
            />
            <button type="button" onClick={searchHotels} className={styles.aiPromptButton}>
              Search Hotels
            </button>
          </div>
          
          {/* Show selected hotel clips */}
          {selectedHotelClips.length > 0 && (
            <div className={styles.selectedClips}>
              {selectedHotelClips.map((clip, idx) => (
                <span key={idx} className={styles.selectedClip}>
                  {clip}
                </span>
              ))}
            </div>
          )}
          {/*<ul className={styles.suggestionsList}>
            {hotelResults.length > 0 ? (
              hotelResults.map((hotel, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedHotel(hotel);
                    setHotelPreference(hotel.name);
                  }}
                >
                  {hotel.name}
                </li>
              ))
            ) : (
              <li>No hotel suggestions found.</li>
            )}
          </ul> */}
        </div>

        {/* Sightseeing Suggestions Section */}
        <div className={styles.section}>
          <h3>Sightseeing Suggestions</h3>
          {/* Predefined Clip Buttons */}
          <div className={styles.clipsContainer}>
            {sightseeingClips.map((clip, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.clipButton}
                onClick={() => toggleSightseeingClip(clip)}
              >
                {clip}
              </button>
            ))}
          </div>
          <div className={styles.promptRow}>
            <input
              type="text"
              value={sightseeingPrompt}
              onChange={(e) => setSightseeingPrompt(e.target.value)}
              placeholder="Enter sightseeing prompt (e.g. Adventure, Cultural)"
              className={styles.aiPromptInput}
            />
            <button type="button" onClick={searchSightseeing} className={styles.aiPromptButton}>
              Search Sightseeing
            </button>
          </div>
          
          {/* Show selected sightseeing clips */}
          {selectedSightseeingClips.length > 0 && (
            <div className={styles.selectedClips}>
              {selectedSightseeingClips.map((clip, idx) => (
                <span key={idx} className={styles.selectedClip}>
                  {clip}
                </span>
              ))}
            </div>
          )}
          {/* <ul className={styles.suggestionsList}>
            {sightseeingResults.length > 0 ? (
              sightseeingResults.map((sight, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedSightseeing(sight);
                    setSightseeingPreference(sight.title);
                  }}
                >
                  {sight.title}
                </li>
              ))
            ) : (
              <li>No sightseeing suggestions found.</li>
            )}
          </ul> */}
        </div>

        {/* Package Summary & Final Submission */}
        <div className={styles.section}>
          <h3>Package Summary</h3>
          <p>
            <strong>Flight:</strong>{" "}
            {selectedFlight
              ? `${selectedFlight.airline} - ${selectedFlight.flightNumber}`
              : "Not selected"}
          </p>
          <p>
            <strong>Hotel:</strong>{" "}
            {selectedHotel ? selectedHotel.name : "Not selected"}
          </p>
          <p>
            <strong>Sightseeing:</strong>{" "}
            {selectedSightseeing ? selectedSightseeing.title : "Not selected"}
          </p>
          <button type="submit" className={styles.aiPromptButton}>
            Generate Combined Package
          </button>
        </div>
      </form>
    </>
  );
}

export default SuggestiveForm;
