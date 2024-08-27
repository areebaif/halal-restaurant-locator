import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { ListStateError, ListStates } from "@/utils/types";

/**
 * @swagger
 * /api/country/usa/states:
 *    get:
 *      tags:
 *        - country
 *      summary: list all U.S.A states stored in the database
 *      description: Returns an array of objects containing state names and state id
 *      operationId: listState
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
  res: NextApiResponse<ListStates | ListStateError>
) {
  try {
    // GET REQUEST METHOD
    if (req.method === "GET") {
      const state = await prisma.state.findMany({
        select: {
          countryId: true,
          stateId: true,
          stateName: true,
          Country: {
            select: { countryName: true },
          },
        },
        orderBy: [
          {
            Country: {
              countryName: "asc",
            },
          },
          { stateName: "asc" },
        ],
      });
      if (!state.length) {
        // there is no data to send
        res.status(200).send([]);
        return;
      }
      const states = state.map((item, index) => {
        return {
          countryId: item.countryId,
          countryName: item.Country.countryName,
          stateName: item.stateName,
          stateId: item.stateId,
        };
      });

      res.status(200).send(states);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalError: ["something went wrong with the server"] },
    });
  }
}
