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
      const { _page } = req.query;
      const { _limit } = req.query;

      if (!_limit?.length || !_page?.length) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              state: ["there was a rpoblem with query param or query string"],
            },
          },
        });
        return;
      }
      const isStateParamCorrect = z.string().uuid().safeParse(state);
      const ispageParamCorrect = z.coerce.number().safeParse(_page);
      const islimitParamCorrect = z.coerce.number().safeParse(_limit);
      if (
        !isStateParamCorrect.success ||
        !ispageParamCorrect ||
        !islimitParamCorrect
      ) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              state: ["there was a rpoblem with query param or query string"],
            },
          },
        });
        return;
      }
      const stateId = state as string;
      const pageNum = parseInt(_page as string) as number;
      const limitVal = parseInt(_limit as string) as number;

      const cityCount = prisma.city.count({
        where: {
          stateId: stateId,
          Country: {
            countryName: "U.S.A",
          },
        },
      });
      const city = prisma.city.findMany({
        skip: pageNum === 1 ? 0 : (pageNum - 1) * limitVal,
        take: limitVal,
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
      const allQueries = await Promise.all([city, cityCount]);
      if (!allQueries[0].length) {
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
        countryName: allQueries[0][0].Country.countryName,
        countryId: allQueries[0][0].countryId,
        stateName: {
          [`${allQueries[0][0].State.stateName}`]: allQueries[0].map(
            (city) => ({
              cityId: city.cityId,
              cityName: city.cityName,
            })
          ),
        },
        stateId: allQueries[0][0].stateId,
        totalCount: allQueries[1],
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
