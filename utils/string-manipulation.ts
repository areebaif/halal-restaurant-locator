import { GetSearchInputs } from "./types";

export const capitalizeFirstWord = (val: string) => {
  return val
    .split(" ")
    .map((word) => word[0].toUpperCase().concat(word.substring(1, word.length)))
    .join(" ");
};

export const parseQueryVals = (val: string): GetSearchInputs => {
  const queryValue = {
    zipcode: "",
    country: "",
    state: "",
    city: "",
    restaurantName: "",
  };
  const allQueryArray = val.split("&");
  switch (allQueryArray.length) {
    case 2: {
      const zipcodeVal = allQueryArray[0];
      const zipcodeSplit = zipcodeVal.split("=");
      queryValue.zipcode = zipcodeSplit[1];
      const countryVal = allQueryArray[1];
      const countrySplit = countryVal.split("=");
      queryValue.country = countrySplit[1];
      return queryValue;
    }
    case 3: {
      const cityVal = allQueryArray[0];
      const citySplit = cityVal.split("=");
      queryValue.city = citySplit[1];

      const stateVal = allQueryArray[1];
      const stateSplit = stateVal.split("=");
      queryValue.state = stateSplit[1];

      const countryVal = allQueryArray[2];
      const countrySplit = countryVal.split("=");
      queryValue.country = countrySplit[1];
      return queryValue;
    }
  }
  return queryValue;
};

export const hasNumbers = (str: string) => {
  return /\d/.test(str);
};

export const onlyNumbers = (str: string) => {
  return /^\d+$/.test(str);
};

export const isValidCoordinate = (val: string) => {
  return /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(val)
}