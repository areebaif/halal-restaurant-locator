/**
 *
 * @swagger
 *
 * /api/restaurant?country=U.S.A&state=Minnesota&city=Minneapolis:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: filter restaurants by zipcode and country
 *       description: Returns geojson restaurant feature collection
 *       operationId: filterRestaurantsByZipcode
 *       parameters:
 *         - name: city
 *           in: query
 *           description: city in USA
 *           required: true
 *           schema:
 *             type: string
 *             example: "Minneapolis"
 *         - name: state
 *           in: query
 *           description: state name
 *           required: true
 *           schema:
 *             type: string
 *             example: "Minnesota"
 *         - name: country
 *           in: query
 *           description: country name
 *           required: true
 *           schema:
 *             type: string
 *             example: "U.S.A"
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
 *                              country:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "The provided country name does not exist in the database"
 *                              state:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "The provided state does not exist in the database"
 *                              city:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "The provided city does not exist in the database"
 *                              zipcode:
 *                                    type: array
 *                                    items:
 *                                      type: string
 *                                      example: "The provided zipcode does not exist in the database"
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
