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

interface FormattedRestaurant {
  id: number;
  name: string;
  updated_at: string;
  description: string;
  image_url: string[];
  menu_url: string;
  longitude: number;
  latitude: number;
  website_url: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

const router = express.Router();

// TODO: api-documentation
// TODO: error handling

// /***************** */ VERY IMPORTANT TODO: *///////////////////////////
// Bug or potential bug fixing
// TODO: if we adding restaurants to the system, then there might be a case where or city is not in database at that point i guess add city street to database
// coon rapids is not a thing in our database but it exists

// TODO: some wierd format for fdate is coming from sql convert date to proper thing iin sql when querying database

// TODO: improvements
// 1) Do promise.all in one endpoint
// 2) make GeoJSOn format function take an array with a certain interface

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
      // TODO: put this in a promise.all
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
  "/api/restaurant/:restaurantname",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("restaurantname");
      const { restaurantname } = req.params;
      const db = req._db;
      console.log(" I am here");
      const restaurant = await Geolocation.getRestaurantsbyNameAndCountryId(
        db,
        restaurantname
      );

      const formatRestaurant: FormattedRestaurant[] = [];
      let lastRestaurantId = 0;
      restaurant?.forEach((item) => {
        const {
          id,
          name,
          updated_at,
          image_url,
          description,
          menu_url,
          website_url,
          longitude,
          latitude,
          street,
          city,
          state,
          zipcode,
          country,
        } = item;
        if (id === lastRestaurantId) {
          formatRestaurant[formatRestaurant.length - 1].image_url.push(
            image_url
          );
        }
        if (id !== lastRestaurantId) {
          lastRestaurantId = id;
          formatRestaurant.push({
            id,
            name,
            updated_at,
            image_url: [image_url],
            description,
            menu_url,
            website_url,
            longitude,
            latitude,
            street,
            city,
            state,
            zipcode,
            country,
          });
        }
      });

      const geojsonrestaurant = formatRestaurant.map((item) => {
        const {
          id,
          name,
          updated_at,
          image_url,
          description,
          menu_url,
          website_url,
          longitude,
          latitude,
          street,
          city,
          state,
          zipcode,
          country,
        } = item;
        const geojson = Geolocation.GeoJSONFormat(latitude, longitude, id, {
          name,
          title: name,
          updated_at,
          description,
          image_url,
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

      res.status(200).send({
        data: geojsonrestaurant,
      });
    } catch (err) {
      console.log(err);
    }
  }
);

export { router as halalFinderRouter };
