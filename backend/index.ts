import express, { NextFunction, Response, Request } from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";
import { Pool, QueryResult } from "pg";
import { dbPool } from "./database/pools";
import { halalFinderRouter } from "./routes/halal-finder";

const PORT = 6000;

const startServer = async () => {
  let db: Pool;
  const connectDb = async () => {
    try {
      if (db) return db;
      db = await dbPool.connect();
      return db;
    } catch (err) {
      throw new Error("Unable to connect to database");
    }
  };
  db = await connectDb();

  const app = express();
  // middleware
  app.use(bodyParser.json());
  app.use(async (req, res, next) => {
    // TODO: check each time if i am making a new connection to the pool if i do pool.connect here and send that value
    req._db = await connectDb();
    next();
  });

  // api-documentation
  // routes
  app.use(halalFinderRouter);

  app.listen(PORT, () => {
    console.log(`dev server running on ${PORT}`);
  });
};

startServer();
