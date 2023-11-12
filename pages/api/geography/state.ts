import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { PostAddStateZod, capitalizeFirstWord } from "@/utils";
import { PostAddState, ReadStateDb, ResponseAddState } from "@/utils/types";

/**
 * @swagger
 * /api/geography/state:
 *    post:
 *     tags:
 *       - geolocations
 *     summary: create multiple states
 *     description: add multiple states to the database.
 *     operationId: createState
 *     requestBody:
 *       description: add multiple state to an exisiting country in the database.
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 countryId:
 *                   type: string
 *                   format: uuid
 *                   example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                 countryName:
 *                   type: string
 *                   example: "U.S.A"
 *                 stateName:
 *                   type: string
 *                   example: ["Minnesota", "Ohio"]
 *
 *       required: true
 *     responses:
 *       '201':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: string
 *                   example: "ok"
 *
 *       '400':
 *         description: Invalid data supplied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorStateCreated'
 *
 *    get:
 *      tags:
 *        - geolocations
 *      summary: get all states stored in the database
 *      description: Returns an array of objects containing state names and state id
 *      operationId: getAllState
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
 */

export default async function State(
  req: NextApiRequest,
  res: NextApiResponse<ResponseAddState | ReadStateDb>
) {
  try {
    // POST REQUEST
    if (req.method === "POST") {
      const stateData = req.body;
      // state will be an array
      const isTypeCorrect = PostAddStateZod.safeParse(stateData);
      if (!isTypeCorrect.success) {
        console.log(isTypeCorrect.error);
        res.status(400).json({
          typeError:
            "type check failed on the server, expected to recieve a single object inside array with countryId property as string and stateName property as array of string",
        });
        return;
      }
      const typeCheckedStateData = stateData as PostAddState;
      const countryStateData = typeCheckedStateData[0];
      const countryId = countryStateData.countryId;

      const countryExists = await prisma.country.findUnique({
        where: {
          countryId: countryId,
        },
      });
      if (!countryExists?.countryId) {
        res.status(400).json({
          country: "The provided countryId doesnot exist in the database",
        });
        return;
      }
      const mapStateData = countryStateData.stateName.map((state) => ({
        countryId: countryStateData.countryId,
        stateName: capitalizeFirstWord(state),
      }));
      const createState = await prisma.state.createMany({
        data: mapStateData,
      });
      res.status(201).json({ created: "ok" });
    }
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
        orderBy: {
          Country: {
            countryName: "asc",
          },
        },
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
          countryNameStateName: `${item.Country.countryName} - ${item.stateName}`,
        };
      });

      res.status(200).send(states);
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        res.status(400).json({
          state:
            "There is a unique constraint violation, the combination of stateName and countryId already exist in the database or you have provided this combination twice",
        });
        return;
      }
    }
    res.status(500).json({ country: "something went wrong with the server" });
  }
}
