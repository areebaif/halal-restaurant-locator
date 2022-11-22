import express, { NextFunction, Response, Request } from "express";
import bodyParser from "body-parser";
import { halalFinderRouter } from "./routes/halal-finder";

const PORT = 6000;

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
