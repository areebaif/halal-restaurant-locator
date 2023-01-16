import express, { NextFunction, Response, Request } from "express";
import rawLocations from "../location.json";

interface locationDocument {
  type: "Feature";
  properties: {
    title: string;
    city: string;
    state_id: string;
    state: string;
    zip: string;
  };
  id: number;
  // coordinates: [longitude, latitude] is the order in which values are inserted in the tuple
  geometry: { coordinates: [number, number]; type: "Point" };
}

let citySet: Set<{ id: number; name: string }>;
let stateSet: Set<{ id: number; name: string }>;

const citySetTemp: Set<string> = new Set();
const stateSetTemp: Set<string> = new Set();

const allRawData: {
  features: locationDocument[];
  type: "FeatureCollection";
} = JSON.parse(JSON.stringify(rawLocations));
// Sending zipSet with coordinates so that map can jump to those coordinates
const zipSet = allRawData.features.map((item) => {
  const properties = item.properties;
  citySetTemp.add(properties.city);
  stateSetTemp.add(properties.state);
  return {
    ...item,
    city_state: `${properties.city}, ${properties.state}`,
  };
});

const arrayCitySet = Array.from(citySetTemp);
const arrayStateSet = Array.from(stateSetTemp);
const mappedCitySet = arrayCitySet.map((item, index) => {
  return { id: index, name: item };
});
const mappedStateSet = arrayStateSet.map((item, index) => {
  return { id: index, name: item };
});

citySet = new Set(mappedCitySet);
stateSet = new Set(mappedStateSet);

const router = express.Router();

// TODO: api-documentation
// TODO: error handling

router.get("/api/dev/client-keys", async (req, res, next) => {
  try {
    console.log("lolz");
    const keys = `${process.env.MAPBOX_ACCESS_TOKEN}`;
    console.log(keys);
    res.status(200).send({
      data: {
        keys: keys,
      },
    });
  } catch (err) {
    //TODO: error handling
    console.log(err);
  }
});

router.get(
  "/api/dev/data",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.header("Content-Type", "application/json");

      res.status(200).send({ data: rawLocations });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/state/:stateId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stateId } = req.params;
      console.log("stateId was hit");
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));
      const arrayState = Array.from(stateSet);
      const stateName = arrayState.filter((item) => {
        return item.id === (stateId === "0" ? 0 : parseInt(stateId));
      });
      const state = stateName[0];
      console.log("stateName", stateName);
      const stateSetLocal = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.state === state.name) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });

      res.status(200).send({
        data: stateSetLocal,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/getGeography",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // TODO: add restaurantName functionality to this
      const db = req._db;
      const citySetTemp: Set<string> = new Set();
      const stateSetTemp: Set<string> = new Set();
      const cityStateTemp: Set<string> = new Set();
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));
      // Sending zipSet with coordinates so that map can jump to those coordinates
      const zipSet = allRawData.features.map((item) => {
        const properties = item.properties;
        citySetTemp.add(properties.city);
        stateSetTemp.add(properties.state);
        const cityState = `${properties.city}, ${properties.state}`;
        cityStateTemp.add(cityState);
        return {
          ...item,
          city_state: `${properties.city}, ${properties.state}`,
        };
      });

      const arrayCitySet = Array.from(citySetTemp);
      const arrayStateSet = Array.from(stateSetTemp);
      const arrayCityState = Array.from(cityStateTemp);
      const allValues: string[] = [];
      console.log(arrayCitySet);

      arrayCityState.forEach((item) => {
        allValues.push(item);
      });
      zipSet.forEach((item) => {
        const zipValue = `${item.city_state}, ${item.properties.zip}`;
        allValues.push(zipValue);
      });

      const mappedCitySet = arrayCitySet.map((item, index) => {
        return { id: index, name: item };
      });
      const mappedStateSet = arrayStateSet.map((item, index) => {
        return { id: index, name: item };
      });

      citySet = new Set(mappedCitySet);
      stateSet = new Set(mappedStateSet);

      res.header("Content-Type", "application/json");

      res.status(200).send({
        data: {
          citySet: mappedCitySet,
          stateSet: mappedStateSet,
          zipSet: zipSet,
          city_state: arrayCityState,
          allValues: allValues,
          // TODO: fix empty object to actually sending data
          restaurantSet: [],
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/:zipcode",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //console.log("I am hitting wring endpoint");
      const { zipcode } = req.params;
      //console.log(zipcode);
      //const zipCode: string = req.body;
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));

      const zipSet = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.zip === zipcode) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });

      res.status(200).send({
        data: zipSet,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/state-city/:stateId/:cityId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cityId, stateId } = req.params;
      console.log(stateId, cityId, "stateID");
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));

      const arrayState = Array.from(stateSet);
      const stateName = arrayState.filter((item) => {
        return item.id === (stateId === "0" ? 0 : parseInt(stateId));
      });
      const state = stateName[0];

      const arrayCity = Array.from(citySet);
      const cityName = arrayCity.filter((item) => {
        return item.id === (cityId === "0" ? 0 : parseInt(cityId));
      });
      const city = cityName[0];

      const cityState = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.state === state.name && properties.city === city.name) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });
      console.log(cityState, "citystate");
      res.status(200).send({
        data: cityState,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/:restaurantname",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("restaurantname");
      // TODO: fix this to be restaurant id
      const { restaurantname } = req.params;
      //const zipCode: string = req.body;
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));

      const titleSet = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.title === restaurantname) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });

      res.status(200).send({
        data: titleSet,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export { router as halalFinderRouter };
