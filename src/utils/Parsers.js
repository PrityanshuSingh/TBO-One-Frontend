// src/utils/tboParsers.js

/**
 * Parses the TBO CountryList XML response into an array of objects
 * [{ code: "IN", name: "India" }, { code: "US", name: "United States" }, ...]
 */
export function parseCountryListXML(xmlStr) {
  const results = [];
  const countryRegex =
    /<Country>[\s\S]*?<Code>(.*?)<\/Code>[\s\S]*?<Name>(.*?)<\/Name>[\s\S]*?<\/Country>/g;
  let match;
  while ((match = countryRegex.exec(xmlStr)) !== null) {
    results.push({ code: match[1], name: match[2] });
  }
  return results;
}

/**
 * Parses the TBO city list response into an array of objects
 * Extracts relevant city details from "Destinations" key in API response
 */
export function parseCityList(destinations) {
  return destinations.map((d) => ({
    cityName: d.CityName,
    countryCode: d.CountryCode,
    countryName: d.CountryName,
    destinationId: d.DestinationId,
    stateProvince: d.StateProvince,
    type: d.Type,
  }));
}
