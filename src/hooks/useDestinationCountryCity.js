// src/hooks/useDestinationCountryCity.js
import { useState } from "react";
import api from "../utils/api";
import { parseCountryListXML, parseCityList } from "../utils/Parsers";

/**
 * useDestinationCountryCity
 * Manages:
 *  - destinationCountry, destinationCountrySuggestions, destinationCountryCode
 *  - destinationCitiesData (full array)
 *  - destinationCity, destinationCitySuggestions, destinationCityObj
 */
export function useDestinationCountryCity(userToken, userIP) {
  // COUNTRY
  const [destinationCountry, setDestinationCountry] = useState("");
  const [destinationCountrySuggestions, setDestinationCountrySuggestions] =
    useState([]);
  const [destinationCountryCode, setDestinationCountryCode] = useState("");

  // CITY
  const [destinationCitiesData, setDestinationCitiesData] = useState([]);
  const [destinationCity, setDestinationCity] = useState("");
  const [destinationCitySuggestions, setDestinationCitySuggestions] = useState(
    []
  );
  const [destinationCityObj, setDestinationCityObj] = useState(null);

  // Called when user types in "Destination Country"
  async function handleDestinationCountryChange(
    e,
    TBO_COUNTRYLIST_URL,
    tokenId
  ) {
    const val = e.target.value;
    setDestinationCountry(val);

    // reset city
    setDestinationCountryCode("");
    setDestinationCitiesData([]);
    setDestinationCity("");
    setDestinationCityObj(null);

    if (!tokenId || val.length < 2) {
      setDestinationCountrySuggestions([]);
      return;
    }
    try {
      const body = {
        ClientId: "ApiIntegrationNew",
        EndUserIp: userIP,
        TokenId: tokenId,
      };
      const res = await api.post(TBO_COUNTRYLIST_URL, body);
      const xmlStr = res.data.CountryList;
      const allCountries = parseCountryListXML(xmlStr);
      const filtered = allCountries.filter((c) =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setDestinationCountrySuggestions(filtered);
    } catch (err) {
      console.error("Error fetching destination countries =>", err);
      setDestinationCountrySuggestions([]);
    }
  }

  // Called when user picks a country from suggestions
  async function selectDestinationCountry(obj, TBO_CITYLIST_URL, tokenId) {
    setDestinationCountry(obj.name);
    setDestinationCountryCode(obj.code);
    setDestinationCountrySuggestions([]);

    if (!tokenId) return;
    try {
      const body = {
        EndUserIp: userIP,
        TokenId: tokenId,
        CountryCode: obj.code,
        SearchType: "1",
      };
      const res = await api.post(TBO_CITYLIST_URL, body);
      const cityArr = parseCityList(res.data?.Destinations || []);
      setDestinationCitiesData(cityArr);

      setDestinationCity("");
      setDestinationCityObj(null);
    } catch (err) {
      console.error("Error fetching destination city list =>", err);
      setDestinationCitiesData([]);
    }
  }

  // Called when user types in "Destination City"
  function handleDestinationCityChange(e) {
    const val = e.target.value;
    setDestinationCity(val);
    setDestinationCityObj(null);

    if (val.length < 1) {
      setDestinationCitySuggestions([]);
      return;
    }
    const filtered = destinationCitiesData.filter((c) =>
      c.cityName.toLowerCase().includes(val.toLowerCase())
    );
    setDestinationCitySuggestions(filtered);
  }

  // Called when user picks a city
  function selectDestinationCity(obj) {
    setDestinationCity(obj.cityName);
    setDestinationCityObj(obj);
    setDestinationCitySuggestions([]);
  }

  // For reset
  function resetDestination() {
    setDestinationCountry("");
    setDestinationCountrySuggestions([]);
    setDestinationCountryCode("");
    setDestinationCitiesData([]);
    setDestinationCity("");
    setDestinationCityObj(null);
    setDestinationCitySuggestions([]);
  }

  return {
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
  };
}
