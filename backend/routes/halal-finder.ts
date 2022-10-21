import express, { NextFunction, Response, Request } from "express";
import rawLocations from "../location.json";
// TODO: separate out routes in this file

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
// api-documentation
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

      //console.log(citySet, "lola");
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

export { router as halalFinderRouter };
