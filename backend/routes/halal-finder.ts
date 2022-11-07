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
  geometry: { coordinates: [number, number]; type: "Point" };
}
const router = express.Router();

// TODO: api-documentation
// TODO: error handling
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
  "/api/dev/getGeography",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const citySet: Set<string> = new Set();
      const stateSet: Set<string> = new Set();
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));
      // Sending zipSet with coordinates so that map can jump to those coordinates
      const zipSet = allRawData.features.map((item) => {
        const properties = item.properties;
        citySet.add(properties.city);
        stateSet.add(properties.state);
        return {
          ...item,
          city_state: `${properties.city}, ${properties.state}`,
        };
      });

      const arrayCitySet = Array.from(citySet);
      const arrayStateSet = Array.from(stateSet);
      res.header("Content-Type", "application/json");

      res.status(200).send({
        data: {
          citySet: arrayCitySet,
          stateSet: arrayStateSet,
          zipSet: zipSet,
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
      const { zipcode } = req.params;
      console.log(zipcode, req.params);
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
  "/api/dev/:state",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { state } = req.params;
      console.log(state, req.params);
      //const zipCode: string = req.body;
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));

      const stateSet = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.state === state) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });

      res.status(200).send({
        data: stateSet,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/:state/:city",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { city, state } = req.params;
      console.log(city, state, req.params);
      //const zipCode: string = req.body;
      const allRawData: {
        features: locationDocument[];
        type: "FeatureCollection";
      } = JSON.parse(JSON.stringify(rawLocations));

      const cityState = allRawData.features.filter((item) => {
        const properties = item.properties;
        if (properties.state === state && properties.city === city) {
          return {
            ...item,
            city_state: `${properties.city}, ${properties.state}`,
          };
        }
      });

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
      const { restaurantname } = req.params;
      console.log(restaurantname, req.params);
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
