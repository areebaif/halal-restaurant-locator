import { ListGeography } from "./types";

export const mapCountryData = (listCountryUSA: ListGeography) => {
  const parsedZipcode = listCountryUSA.zipcode?.map(
    (item) => `${item.zipcode}, ${listCountryUSA.country?.countryName}`
  );
  const parsedCity = listCountryUSA.city?.map(
    (city) =>
      `${city.cityName}, ${city.stateName}, ${listCountryUSA.country?.countryName}`
  );
  let mergedData: string[] = [];
  if (parsedZipcode) {
    mergedData = [...mergedData, ...parsedZipcode];
  }
  if (parsedCity) {
    mergedData = [...mergedData, ...parsedCity];
  }
  return mergedData;
};
