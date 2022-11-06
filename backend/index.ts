import express, { NextFunction, Response, Request } from "express";
import bodyParser from "body-parser";
//import fs from "fs/promises"
import rawLocations from "./location.json";
import { halalFinderRouter } from "./routes/halal-finder";

// TODO: start script
// "start": "ts-node-dev src/index.ts"
const PORT = 5000;

const startServer = async () => {
  const app = express();
  // middleware
  app.use(bodyParser.json());

  // api-documentation
  // routes
  app.use(halalFinderRouter);

  app.listen(PORT, () => {
    console.log(`dev server running on ${PORT}`);
  });
};

startServer();
