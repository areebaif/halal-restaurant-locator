import express, { NextFunction, Response, Request } from "express";
import rawLocations from "../location.json";
// TODO: separate out routes in this file
const router = express.Router();
// api-documentation
router.get(
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

export { router as halalFinderRouter };
