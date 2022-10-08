import express, { NextFunction, Response, Request } from "express";
import bodyParser from "body-parser";
//import fs from "fs/promises"
import rawLocations from "./location.json";

// TODO: start script
// "start": "ts-node-dev src/index.ts"
const PORT = 5000;

const startServer = async () => {
  const app = express();
  // middleware
  app.use(bodyParser.json());

  // api-documentation
  app.get(
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

  app.listen(PORT, () => {
    console.log(`dev server running on ${PORT}`);
  });
};

startServer();
