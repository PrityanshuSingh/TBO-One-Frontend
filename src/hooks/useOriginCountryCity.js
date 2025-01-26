// src/hooks/useOriginCountryCity.js
import { useState } from "react";
import axios from "axios";
import { parseCountryListXML, parseCityList } from "../utils/Parsers";

/**
 * useOriginCountryCity
 * Manages:
 *  - originCountry, originCountrySuggestions, originCountryCode
 *  - originCitiesData (full array)
 *  - originCity, originCitySuggestions, originCityObj
 */
export function useOriginCountryCity(userToken, userIP) {
  // COUNTRY
  const [originCountry, setOriginCountry] = useState("");
  const [originCountrySuggestions, setOriginCountrySuggestions] = useState([]);
  const [originCountryCode, setOriginCountryCode] = useState("");
  
  // CITY
  const [originCitiesData, setOriginCitiesData] = useState([]);
  const [originCity, setOriginCity] = useState("");
  const [originCitySuggestions, setOriginCitySuggestions] = useState([]);
  const [originCityObj, setOriginCityObj] = useState(null);

  // Called when user types in "Origin Country"
  async function handleOriginCountryChange(e, TBO_COUNTRYLIST_URL, tokenId) {
    const val = e.target.value;
    setOriginCountry(val);

    // reset city
    setOriginCountryCode("");
    setOriginCitiesData([]);
    setOriginCity("");
    setOriginCityObj(null);

    if (!tokenId || val.length < 2) {
      setOriginCountrySuggestions([]);
      return;
    }
    try {
      const body = {
        ClientId: "ApiIntegrationNew",
        EndUserIp: userIP,
        TokenId: tokenId
      };
      const res = await axios.post(TBO_COUNTRYLIST_URL, body);
      const xmlStr = res.data.CountryList;
      const allCountries = parseCountryListXML(xmlStr);
      const filtered = allCountries.filter(c =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setOriginCountrySuggestions(filtered);
    } catch (err) {
      console.error("Error fetching origin countries =>", err);
      setOriginCountrySuggestions([]);
    }
  }

  // Called when user picks a country from suggestions
  async function selectOriginCountry(obj, TBO_CITYLIST_URL, tokenId) {
    setOriginCountry(obj.name);
    setOriginCountryCode(obj.code);
    setOriginCountrySuggestions([]);

    // fetch city list
    if (!tokenId) return;
    try {
      const body = {
        EndUserIp: userIP,
        TokenId: tokenId,
        CountryCode: obj.code,
        SearchType: "1"
      };
      const res = await axios.post(TBO_CITYLIST_URL, body);
      const cityArr = parseCityList(res.data?.Destinations || []);
      setOriginCitiesData(cityArr);

      setOriginCity("");
      setOriginCityObj(null);
    } catch (err) {
      console.error("Error fetching origin city list =>", err);
      setOriginCitiesData([]);
    }
  }

  // Called when user types in "Origin City"
  function handleOriginCityChange(e) {
    const val = e.target.value;
    setOriginCity(val);
    setOriginCityObj(null);

    if (val.length < 1) {
      setOriginCitySuggestions([]);
      return;
    }
    const filtered = originCitiesData.filter(c =>
      c.cityName.toLowerCase().includes(val.toLowerCase())
    );
    setOriginCitySuggestions(filtered);
  }

  // Called when user picks an origin city from suggestions
  function selectOriginCity(obj) {
    setOriginCity(obj.cityName);
    setOriginCityObj(obj);
    setOriginCitySuggestions([]);
  }

  // For reset
  function resetOrigin() {
    setOriginCountry("");
    setOriginCountrySuggestions([]);
    setOriginCountryCode("");
    setOriginCitiesData([]);
    setOriginCity("");
    setOriginCityObj(null);
    setOriginCitySuggestions([]);
  }

  return {
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
    resetOrigin
  };
}
