import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { ListStateError, ListStates } from "@/utils/types";

/**
 * @swagger
 * /api/auth/signin:
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
 *                        countryNameStateName:
 *                          type: string
 *                          example: "U.S.A - Minnesota"
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

export default async function SignIn(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET REQUEST METHOD
    if (req.method === "GET") {
      const { email, password } = req.body;
      // TODO: add password field
      const user = await prisma.user.findUnique({ where: { email: email } });

      // compare passwords
      
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalError: ["something went wrong with the server"] },
    });
  }
}
