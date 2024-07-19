import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { ListCities, ListCitiesError } from "@/utils/types";
// TODO: fix typing jsdocs
/**
 * @swagger
 * /api/country/usa/states/{stateId}:
 *    get:
 *      tags:
 *        - country
 *      summary: list all cities in a particular state in U.S.A
 *      description: Returns an array of objects containing state names and state id, city name and cityId along with country name and countryId.
 *      operationId: listState
 *      parameters:
 *        - name: stateId
 *          in: path
 *          description: state in U.S.A
 *          required: true
 *          schema:
 *            type: string
 *            example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *      responses:
 *        '200':
 *          description: successful operation
 *          content:
 *            application/json:
 *              schema:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        countryId:
 *                          type: string
 *                          format: uuid
 *                          example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                        countryName:
 *                          type: string
 *                          example: "U.S.A"
 *                        stateId:
 *                          type: string
 *                          format: uuid
 *                          example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                        stateName:
 *                          type: string
 *                          example: "Minnesota"
 *        '500':
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    apiErrors:
 *                      type: object
 *                      properties:
 *                        generalErrors:
 *                          type: array
 *                          items:
 *                            type: string
 *                            example: "something went wrong with the server"
 *
 */

export default async function State(
  req: NextApiRequest,
  res: NextApiResponse<ListCities | ListCitiesError>
) {
  try {
    // GET REQUEST METHOD
    if (req.method === "GET") {
      const { state } = req.query;
      const isQueryParamCorrect = z.string().uuid().safeParse(state);
      if (!isQueryParamCorrect.success) {
        console.log(isQueryParamCorrect.error);
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              state: ["expected query param as string with valid uuid"],
            },
          },
        });
        return;
      }
      const stateId = state as string;
      const city = await prisma.city.findMany({
        select: {
          countryId: true,
          stateId: true,
          cityId: true,
          cityName: true,
          Country: {
            select: { countryName: true },
          },
          State: {
            select: { stateName: true },
          },
        },
        where: {
          stateId: stateId,
          Country: {
            countryName: "U.S.A",
          },
        },
        orderBy: [
          {
            Country: {
              countryName: "asc",
            },
          },
          {
            State: {
              stateName: "asc",
            },
          },
          { cityName: "asc" },
        ],
      });
      if (!city.length) {
        // there is no data to send
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              state: ["no cities found with provided stateId"],
            },
          },
        });
        return;
      }
      const result = {
        countryName: city[0].Country.countryName,
        countryId: city[0].countryId,
        stateName: {
          [`${city[0].State.stateName}`]: city.map((city) => ({
            cityId: city.cityId,
            cityName: city.cityName,
          })),
        },
        stateId: city[0].stateId,
      };

      res.status(200).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalError: ["something went wrong with the server"] },
    });
  }
}
