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
  // TODO: we need to properly returnb data types
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
      if (!rows.length) throw new Error("unable to retrive states");
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
      if (!rows.length) throw new Error("unable to retrive states");
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
      if (!rows.length) throw new Error("unable to retrive states");
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
      if (!rows.length) throw new Error("unable to retrive states");
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
      if (!rows.length) throw new Error("unable to retrive states");
      return rows;
    } catch (err) {
      // TODO: error handling
      console.log(err);
    }
  };
}
