import express, { NextFunction, Response, Request } from "express";
import "dotenv/config.js";
import bodyParser from "body-parser";
import { Pool } from "pg";
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
      throw new Error("Unable to connect to database pool client");
    }
  };
  // TODO: error handling
  // check: first when app starts we have a connection to the database
  db = await connectDb();

  const app = express();
  // middleware
  app.use(bodyParser.json());
  app.use(async (req, res, next) => {
    // check connection is live before attaching it to request object and sending it.
    // TODO: try catch and retry if connection drops.
    req._db = db;
    next();
  });

  // TODO: api-documentation
  // routes
  app.use(halalFinderRouter);

  app.listen(PORT, () => {
    console.log(`dev server running on ${PORT}`);
  });
};

startServer();
