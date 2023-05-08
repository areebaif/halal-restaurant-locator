import { Pool, QueryResult } from "pg";
import { dbPool } from "../pools";

export interface zipcodeDbRow {
  id: number;
  state_id: number;
  city_id: number;
  country_id: number;
  zipcode: string;
  longitude: number;
  latitude: number;
  geography: string /* This is a postqres geography type, not sure how to annotate ot in typescript */;
  created_at?: string;
}

export interface streetDbRow {
  id: number;
  state_id: number;
  city_id: number;
  zipcode_id: number;
  country_id: number;
  name: string;
  created_at?: string;
}

export interface restaurantDbRow {
  id: number;
  name: string;
  description?: string;
  website_url?: string;
  menu_url?: string;
  state_id: number;
  city_id: number;
  country_id: number;
  zipcode_id: string;
  longitude: number;
  latitude: number;
  geography: string /* This is a postqres geography type, not sure how to annotate ot in typescript */;
  created_at?: string;
  updated_at?: string;
}

export interface stateDbRow {
  id: number;
  name: string;
  country_id: number;
  created_at?: string;
}

export interface cityDbRow {
  id: number;
  name: string;
  state_id: number;
  country_id: number;
  created_at?: string;
}

export class Geolocation {
  //constructor(private data: TaskAttrs) {}
  // TODO: we need to properly return data types
  static getAllStatebyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<stateDbRow> = await db.query(
        `SELECT * FROM state
        WHERE country_id=$1;`,
        [id]
      );
      if (!rows.length)
        throw new Error(`
      no state found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getStatebyIdCountryId = async (
    db: Pool | undefined,
    stateId: number,
    countryId: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<stateDbRow> = await db.query(
        `SELECT * FROM state
        WHERE country_id=$1 AND id=$2;`,
        [countryId, stateId]
      );
      if (!rows.length)
        throw new Error(`
      no state found with country_id ${countryId} and state_id ${stateId}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getAllCitybyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<cityDbRow> = await db.query(
        `select distinct(name), id, state_id, country_id
        from city
        WHERE country_id=$1;`,
        [id]
      );
      if (!rows.length) throw new Error(`no city found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };
  static getAllCityAndStatebyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<{ city: string; country: string; state: string }> =
        await db.query(
          `select city.name as city, city.country_id as country, state.name as state
        from city
        inner join state
        on city.state_id=state.id
        where city.country_id=$1;`,
          [id]
        );
      if (!rows.length)
        throw new Error(`no state and city found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getAllZipcodebyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<
        zipcodeDbRow & { city: string; state: string; country: string }
      > = await db.query(
        `select zipcode.id, zipcode.zipcode, zipcode.longitude, zipcode.latitude, country.name as country, city.name as city, state.name as state
        from zipcode
        inner join city
        on zipcode.city_id = city.id
        inner join state
        on city.state_id = state.id
        inner join country
        on state.country_id=country.id
        where zipcode.country_id=$1;`,
        [id]
      );
      if (!rows.length)
        throw new Error(`no zipcode found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getZipcodeByStateCityAndCountryId = async (
    db: Pool | undefined,
    cityId: number,
    stateId: number,
    countryId: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<zipcodeDbRow> = await db.query(
        `select * from zipcode where state_id=$2 and city_id=$1 and country_id=$3;`,
        [cityId, stateId, countryId]
      );
      if (!rows.length)
        throw new Error(
          `no zipcode found with country_id ${countryId} state_id ${stateId} city_id ${cityId}`
        );
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getZipcodeByStateAndCountryId = async (
    db: Pool | undefined,
    stateId: number,
    countryId: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      console.log("state", stateId);
      const { rows }: QueryResult<zipcodeDbRow & { state_name: string }> =
        await db.query(
          `select zipcode.id, zipcode.zipcode ,zipcode.longitude, zipcode.latitude, zipcode.state_id, zipcode.country_id, state.name as state_name from zipcode
        inner join state
        on zipcode.state_id = state.id
        where zipcode.state_id =$1 
        and zipcode.country_id = $2`,
          [stateId, countryId]
        );
      if (!rows.length)
        throw new Error(
          `no zipcode found with country_id ${countryId} state_id ${stateId} `
        );
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getZipcodeByIdAndCountryId = async (
    db: Pool | undefined,
    zipcodeId: number,
    countryId: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<zipcodeDbRow & { stateName: string }> =
        await db.query(
          `select * from zipcode
          where id=$1
          and country_id=$2`,
          [zipcodeId, countryId]
        );
      if (!rows.length)
        throw new Error(
          `no zipcode found with country_id ${countryId} zipcode_id ${zipcodeId} `
        );
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static GeoJSONFormat = (
    latitude: number,
    longitude: number,
    id: number,
    geojsonProperites: { [key: string]: string | number | string[] }
  ) => {
    const obj = Object.entries(geojsonProperites);

    const properties: { [key: string]: string | number | string[] } = {};
    // do not do direct object assignments since objects are passed by reference
    obj.forEach((element) => {
      const prop = element[0];
      const value = element[1];
      properties[prop] = value;
    });

    return {
      type: "Feature",
      properties: properties,
      id: id,
      geometry: {
        coordinates: [longitude, latitude],
        type: "Point",
      },
    };
  };

  // TODO: after getting the restaurant query with image url, you need to do some data manupulateion to store image urls in an array and send to front-end
  // TODO: for populating data in the search bar just do a slect * from restaurant wiht joins on city, state, geogrpahy and send it to front end
  // TODO: build functions to send restaurant by state, state and city, by zipcode.

  static getAllRestaurantsbyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<{
        id: number;
        name: string;
        updated_at: string;
        description: string;
        menu_url: string;
        longitude: number;
        latitude: number;
        website_url: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
      }> = await db.query(
        `select restaurant.id,restaurant.name,restaurant.updated_at,restaurant.description, restaurant.menu_url, restaurant.website_url,restaurant.longitude, restaurant.latitude ,street.name as street, city.name as city, state.name as state, zipcode.zipcode as zipcode ,country.name as country
        from restaurant
        inner join street
        on restaurant.street_id=street.id
        inner join city
        on restaurant.city_id = city.id
        inner join state
        on city.state_id = state.id
        inner join zipcode
        on zipcode.id = restaurant.zipcode_id
        inner join country
        on state.country_id=country.id
        where country.id=$1;`,
        [id]
      );
      if (!rows.length)
        throw new Error(`
      no state found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };
  // TODO: get url of images aswell fo restaurant
  static getDistinctRestaurantsNamesbyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<{
        name: string;
        country_id: number;
      }> = await db.query(
        `select distinct name, country_id 
        from restaurant
        where country_id=$1`,
        [id]
      );
      if (!rows.length)
        throw new Error(`
      no state found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getStreetNamesbyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows }: QueryResult<streetDbRow> = await db.query(
        `select * from street where country_id=$1`,
        [id]
      );
      if (!rows.length)
        throw new Error(`
      no street found with country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getRestaurantsbyNameAndCountryId = async (
    db: Pool | undefined,
    name: string,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<{
        id: number;
        name: string;
        updated_at: string;
        description: string;
        image_url: string;
        menu_url: string;
        longitude: number;
        latitude: number;
        website_url: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
      }> = await db.query(
        `select p1.id,p1.name,p1.updated_at,image.url as image_url,p1.description, p1.menu_url, p1.website_url,p1.longitude, p1.latitude ,street.name as street, city.name as city, state.name as state, zipcode.zipcode as zipcode ,country.name as country
        from restaurant as p1
        inner join street
        on p1.street_id=street.id
        inner join city
        on p1.city_id = city.id
        inner join state
        on p1.state_id = state.id
        inner join zipcode
        on zipcode.id = p1.zipcode_id
        inner join country
        on p1.country_id=country.id
		    full join restaurant_image
		    on p1.id = restaurant_image.restaurant_id
		    full join image
		    on restaurant_image.image_id = image.id
        where country.id=$2 and p1.name=$1`,
        [name, id]
      );
      if (!rows.length)
        throw new Error(`
      no restaurant found with name ${name} and country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };

  static getRestaurantsbyIdAndCountryId = async (
    db: Pool | undefined,
    restaurantId: number,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const {
        rows,
      }: QueryResult<{
        id: number;
        name: string;
        updated_at: string;
        description: string;
        image_url: string;
        menu_url: string;
        longitude: number;
        latitude: number;
        website_url: string;
        street: string;
        city: string;
        state: string;
        zipcode: string;
        country: string;
      }> = await db.query(
        `select p1.id,p1.name,p1.updated_at,image.url as image_url,p1.description, p1.menu_url, p1.website_url,p1.longitude, p1.latitude ,street.name as street, city.name as city, state.name as state, zipcode.zipcode as zipcode ,country.name as country
        from restaurant as p1
        inner join street
        on p1.street_id=street.id
        inner join city
        on p1.city_id = city.id
        inner join state
        on p1.state_id = state.id
        inner join zipcode
        on zipcode.id = p1.zipcode_id
        inner join country
        on p1.country_id=country.id
		    full join restaurant_image
		    on p1.id = restaurant_image.restaurant_id
		    full join image
		    on restaurant_image.image_id = image.id
        where country.id=$2 and p1.id=$1`,
        [restaurantId, id]
      );
      if (!rows.length)
        throw new Error(`
      no restaurant found with name ${name} and country_id ${id}`);
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };
}
