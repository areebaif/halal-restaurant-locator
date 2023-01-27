import express, { NextFunction, Response, Request } from "express";
import rawLocations from "../location.json";
import { Geolocation } from "../database/sql-queries/geolocation";

interface locationDocument {
  type: "Feature";
  properties: {
    // title prop is used by mapbox to populate values on location layer to display title
    // cityName
    title: string;
    //cityName
    city: string;
    //shortform of state
    state_id: string;
    // statename
    state: string;
    //zipcode
    zip: string;
  };
  id: number;
  // coordinates: [longitude, latitude] is the order in which values are inserted in the tuple
  geometry: { coordinates: [number, number]; type: "Point" };
}

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
  "/api/dev/zipcodes/state/:stateId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { stateId } = req.params;
      const db = req._db;
      const zipcodesByState = await Geolocation.getZipcodeByStateAndCountryId(
        db,
        parseInt(stateId)
      );
      const zipcodeGeoJSON = zipcodesByState?.map((item) => {
        const geojson = Geolocation.GeoJSONFormat(
          item.latitude,
          item.longitude,
          item.id,
          {
            title: item.state_name,
            state: item.state_name,
            state_id: item.state_id,
            zipcode: item.zipcode,
            country_id: item.country_id,
          }
        );

        return geojson;
      });

      res.status(200).send({
        data: zipcodeGeoJSON,
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
      const db = req._db;
      // fetch data from postqres
      const state = await Geolocation.getAllStatebyCountryId(db);
      const city = await Geolocation.getAllCitybyCountryId(db);
      const city_state = await Geolocation.getAllCityAndStatebyCountryId(db);
      const zipcode = await Geolocation.getAllZipcodebyCountryId(db);
      const restaurant = await Geolocation.getAllRestaurantsbyCountryId(db);
      // distinct restaurant names
      const distinctRestaurantNames =
        await Geolocation.getDistinctRestaurantsNamesbyCountryId(db);

      const street = await Geolocation.getStreetNamesbyCountryId(db);

      // format data to send to front end

      const cityAndState = city_state?.map((item) => {
        return `${item.city}, ${item.state}`;
      });
      const restaurantGEOJSON = restaurant?.map((item) => {
        const {
          name,
          updated_at,
          description,
          menu_url,
          website_url,
          street,
          city,
          state,
          zipcode,
          country,
          latitude,
          longitude,
          id,
        } = item;
        const geojson = Geolocation.GeoJSONFormat(latitude, longitude, id, {
          name,
          updated_at,
          description,
          menu_url,
          website_url,
          street,
          city,
          state,
          zipcode,
          country,
        });
        return geojson;
      });
      const zipcodeGEOJSON = zipcode?.map((item) => {
        const geojson = Geolocation.GeoJSONFormat(
          item.latitude,
          item.latitude,
          item.id,
          {
            city: item.city,
            state: item.state,
            zipcode: item.zipcode,
            country: item.country,
          }
        );
        return geojson;
      });

      const allValuesObj: {
        value: string;
        label: string;
        description?: string;
      }[] = [];

      distinctRestaurantNames?.forEach((item) => {
        const label = `${item.name}`;
        const value = `${item.name}`;
        const description = `see locations`;
        allValuesObj.push({ value, label, description });
      });

      cityAndState?.forEach((item) => {
        allValuesObj.push({ value: item, label: item });
      });

      zipcodeGEOJSON?.forEach((item) => {
        const string_value = `${item.properties.city}, ${item.properties.state}, ${item.properties.zipcode}`;
        allValuesObj.push({ value: string_value, label: string_value });
      });

      restaurantGEOJSON?.forEach((item) => {
        const string_value = `${item.properties.street}, ${item.properties.city}, ${item.properties.state}, ${item.properties.zipcode}`;
        allValuesObj.push({
          value: `${item.properties.name}, ${item.properties.street}, ${item.properties.city}, ${item.properties.state}, ${item.properties.zipcode}`,
          label: `${item.properties.name}`,
          description: string_value,
        });
      });

      // const autoCompleteData = allValuesObj.map((item) => ({
      //   ...item,
      //   value: item.value,
      // }));

      res.header("Content-Type", "application/json");
      res.status(200).send({
        data: {
          citySet: city,
          stateSet: state,
          zipSet: zipcodeGEOJSON,
          city_state: cityAndState,
          restaurantSet: restaurantGEOJSON,
          autoCompleteData: allValuesObj,
          distinctRestaurantNames,
          street,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
);

router.get(
  "/api/dev/:zipcodeId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { zipcodeId } = req.params;
      const db = req._db;
      const zipcode = await Geolocation.getZipcodeByIdAndCountryId(
        db,
        parseInt(zipcodeId)
      );
      const zipcodeGeoJSON = zipcode?.map((item) => {
        const geojson = Geolocation.GeoJSONFormat(
          item.latitude,
          item.longitude,
          item.id,
          {
            title: item.zipcode,
            id: item.id,
            zipcode: item.zipcode,
            country: item.country_id,
          }
        );

        return geojson;
      });
      res.status(200).send({
        data: zipcodeGeoJSON,
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
      const db = req._db;
      const parsedCityId = parseInt(cityId);
      const parsedStateId = parseInt(stateId);
      const zipcode = await Geolocation.getZipcodeByStateCityAndCountryId(
        db,
        parsedCityId,
        parsedStateId
      );
      const zipcodeGEOJSON = zipcode?.map((item) => {
        const geojson = Geolocation.GeoJSONFormat(
          item.latitude,
          item.longitude,
          item.id,
          {
            title: item.zipcode,
            city: item.city_id,
            state_id: item.state_id,
            zipcode: item.zipcode,
            country_id: item.country_id,
          }
        );

        return geojson;
      });
      res.status(200).send({
        data: zipcodeGEOJSON,
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
      // TODO: do postqres sql function
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
