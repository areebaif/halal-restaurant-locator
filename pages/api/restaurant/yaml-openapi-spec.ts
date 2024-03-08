/**
 *
 * @swagger
 *
 * /api/restaurant/{country}&{state}&{city}:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: find restaurants depending on query parameters
 *       description: Returns geojson restaurant feature collection
 *       operationId: searchRestaurant
 *       parameters:
 *         - name: city
 *           in: path
 *           description: city in USA
 *           required: true
 *           schema:
 *             type: string
 *             example: "Minneapolis"
 *         - name: state
 *           in: path
 *           description: state name
 *           required: true
 *           schema:
 *             type: string
 *             example: "Minnesota"
 *         - name: country
 *           in: path
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
 *                     typeError:
 *                       type: string
 *                       example: "type check failed on the server, expected to an objects with countryName as string, and either zipcode as string or restaurantName as string or stateName, cityName, as string"
 *                     country:
 *                       type: string
 *                       example: "The provided countryName doesnot exist in the database"
 *                     state:
 *                       type: string
 *                       example: "The provided stateName inreference to countryId doesnot exist in the database"
 *                     city:
 *                       type: string
 *                       example: "The provided cityName in reference to countryId and stateName doesnot exist in the database"
 *
 */
