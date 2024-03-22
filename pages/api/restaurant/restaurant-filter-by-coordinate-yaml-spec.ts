/**
 *
 * @swagger
 *
 * /api/restaurant?latitude=45.0527951&longitude=-93.2495228:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: filter restaurants, include restaurants only in a search radius
 *       description: Returns geojson restaurant feature collection
 *       operationId: filterRestaurantByCoordinates
 *       parameters:
 *         - name: latitude
 *           in: query
 *           description: latitude in U.S.A
 *           required: true
 *           schema:
 *             type: string
 *             example: "45.0527951"
 *         - name: longitude
 *           in: query
 *           description: latitude in U.S.A
 *           required: true
 *           schema:
 *             type: string
 *             example: "-93.2495228"
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "FeatureCollection"
 *                   features:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                           example: "Feature"
 *                         id:
 *                           type: number
 *                         geometry:
 *                           type: object
 *                           properties:
 *                             type:
 *                               type: string
 *                               example: "Point"
 *                             coordinates:
 *                               type: array
 *                               items:
 *                                 type: number
 *                                 example: -84.8076, 45.944
 *                         properties:
 *                            type: object
 *                            properties:
 *                              restaurantId:
 *                                type: string
 *                                format: uuid
 *                                example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                              restaurantName:
 *                                type: string
 *                              description:
 *                                type: string
 *                              street:
 *                                type: string
 *                                example: string
 *                              country:
 *                                type: string
 *                                example: "U.S.A"
 *                              state:
 *                                type: string
 *                                example: "Minnesota"
 *                              city:
 *                                type: string
 *                                example: "Minneapolis"
 *                              zipcode:
 *                                type: string
 *                                example: "55442"
 *                              foodTag:
 *                                type: array
 *                                items:
 *                                  type:
 *                                    string
 *                                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *
 *         '400':
 *           description: Invalid data supplied
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     apiErrors:
 *                       type: object
 *                       properties:
 *                          validationErrors:
 *                            type: object
 *                            properties:
 *                              coordinates:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "please provide value for latitude and longitude in the query parameters"
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                     apiErrors:
 *                       type: object
 *                       properties:
 *                         generalErrors:
 *                           type: array
 *                           items:
 *                             type: string
 *                             example: "something went wrong with the server"

 */
