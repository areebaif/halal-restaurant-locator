import { Pool, QueryResult } from "pg";
import { dbPool } from "../pools";

export class Geolocation {
  //constructor(private data: TaskAttrs) {}
  // TODO: we need to properly returnb data types
  static getAllStatebyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows } = await db.query(
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
      const { rows } = await db.query(
        `select distinct(name), id
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
  static getCityAndStatebyCountryId = async (
    db: Pool | undefined,
    id: number = 1
  ) => {
    try {
      db = await dbPool.connect();
      const { rows } = await db.query(
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
      const { rows } = await db.query(
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
}
