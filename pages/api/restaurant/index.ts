import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import {
  CreateRestaurant,
  CreateRestaurantSuccess,
  CreateRestaurantError,
  FilterRestaurantsByZipcode,
  FilterRestaurantsByCity,
  FilterRestaurantsErrors,
  GeoJsonFeatureCollectionRestaurants,
} from "@/utils/types";
import {
  filterRestaurants,
  capitalizeFirstWord,
  FilterRestaurantsByZipcodeSchema,
  FilterRestaurantsByCitySchema,
  CreateRestaurantSchema,
  isValidCoordinate,
  boundingBoxCalc,
} from "@/utils";
import { dataToGeoJson } from "@/utils/api-utils";
import { search_radius_miles_backend } from "@/utils/constants";

/**
 *
 * @swagger
 * /api/restaurant:
 *    post:
 *      tags:
 *        - restaurants
 *      summary: create a new restaurant
 *      description: add a restaurant to the database.
 *      operationId: createRestaurant
 *      requestBody:
 *        description: add a restaurant in the database.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                countryId:
 *                  type: string
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                stateId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                cityId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                zipcodeId:
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                restaurantId:
 *                  type: string
 *                  format: uuid
 *                  example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                latitude:
 *                  type: number
 *                  format: float
 *                  example: 45.04856
 *                longitude:
 *                  type: number
 *                  format: float
 *                  example: -93.4269,
 *                foodTag:
 *                  type: array
 *                  items:
 *                    type:
 *                      string
 *                    example: "64b31531-28fd-4570-ad64-6aa312e53d69"
 *                street:
 *                  type: string
 *                  example: string
 *                restaurantName:
 *                  type: string
 *                description:
 *                  type: string
 *                imageUrl:
 *                  type: array
 *                  items:
 *                    type:
 *                      string
 *                    example: "d16d6b71-c382-48ba-986b-c570b450f430/cover/131fa780-92e0-4c30-8428-9a5c780a91a3.png"
 *
 *        required: true
 *      responses:
 *        '201':
 *          description: Successful operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  created:
 *                    type: boolean
 *                    example: true
 *                  restaurantId:
 *                    type: string
 *                    example: "d16d6b71-c382-48ba-986b-c570b450f430"
 *        '400':
 *          description: Invalid data supplied
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    apiErrors:
 *                      type: object
 *                      properties:
 *                        validationErrors:
 *                          type: object
 *                          properties:
 *                            foodtag:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for foodTagId"
 *                            countryId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for countryId"
 *                            stateId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for stateId"
 *                            cityId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for cityId"
 *                            zipcodeId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "please provide valid value for zipcodeId"
 *                            restaurantId:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "The id should follow uuid format"
 *                            latitude:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid latitude as float in the range of -90 to 90"
 *                            longitude:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid longitude as float in the range of -180 to 180"
 *                            street:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide street value as string"
 *                            restaurantName:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide restaurantName value as string"
 *                            description:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide description value as string"
 *                            imageUrl:
 *                              type: array
 *                              items:
 *                                type: string
 *                                example: "provide valid imageUrl as string"
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
 * /api/restaurant?country=U.S.A&zipcode=55433:
 *     get:
 *       tags:
 *         - restaurants
 *       summary: filter restaurants by city, state and country
 *       description: Returns geojson restaurant feature collection
 *       operationId: filterRestaurantsByCity
 *       parameters:
 *         - name: zipcode
 *           in: query
 *           description: zipcode in USA
 *           required: true
 *           schema:
 *             type: string
 *             example: "55442"
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
 *                                country:
 *                                      type: array
 *                                      items:
 *                                        type: string
 *                                        example: "The provided country name does not exist in the database"
 *                                state:
 *                                      type: array
 *                                      items:
 *                                        type: string
 *                                        example: "The provided state does not exist in the database"
 *                                city:
 *                                      type: array
 *                                      items:
 *                                        type: string
 *                                        example: "The provided city does not exist in the database"
 *                                zipcode:
 *                                      type: array
 *                                      items:
 *                                        type: string
 *                                        example: "The provided zipcode does not exist in the database"
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

type RestaurantBySearchRadius = {
  restaurantId: string;
  latitude: number;
  longitude: number;
  restaurantName: string;
  description: string;
  street: string;
  countryName: string;
  stateName: string;
  cityName: string;
  zipcode: string;
  //comma separated list as string;
  foodTag: string;
  //comma separated list as string;
  imageUrl: string;
}[];

export default async function AddRestaurant(
  req: NextApiRequest,
  res: NextApiResponse<
    | CreateRestaurantSuccess
    | CreateRestaurantError
    | FilterRestaurantsErrors
    | GeoJsonFeatureCollectionRestaurants
  >
) {
  try {
    if (req.method === "POST") {
      const restaurantData = req.body;
      const isTypeCorrect = CreateRestaurantSchema.safeParse(restaurantData);
      if (!isTypeCorrect.success) {
        const {
          restaurantId,
          restaurantName,
          countryId,
          stateId,
          cityId,
          foodTag,
          description,
          street,
          latitude,
          longitude,
          imageUrl,
          zipcodeId,
        } = isTypeCorrect.error.flatten().fieldErrors;

        res.status(400).json({
          apiErrors: {
            validationErrors: {
              restaurantId,
              countryId,
              stateId,
              cityId,
              foodTag,
              description,
              street,
              latitude,
              longitude,
              imageUrl,
              zipcodeId,
              restaurantName,
            },
          },
        });
        return;
      }

      const restaurant = restaurantData as CreateRestaurant;
      const {
        countryId,
        stateId,
        cityId,
        foodTag,
        description,
        street,
        latitude,
        longitude,
        imageUrl,
        zipcodeId,
        restaurantName,
        restaurantId,
      } = restaurant;

      z.string().uuid().safeParse(restaurantId);
      const countryExists = await prisma.country.findUnique({
        where: {
          countryId: countryId,
        },
      });
      if (!countryExists?.countryId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              countryId: [
                "The provided countryId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }
      const stateExists = await prisma.state.findUnique({
        where: {
          stateId: stateId,
        },
      });
      if (!stateExists?.stateId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              stateId: ["The provided stateId does not exist in the database."],
            },
          },
        });
        return;
      }
      const cityExists = await prisma.city.findUnique({
        where: {
          cityId: cityId,
        },
      });
      if (!cityExists?.cityId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              cityId: ["The provided cityId does not exist in the database."],
            },
          },
        });
        return;
      }

      const zipcodeExists = await prisma.zipcode.findUnique({
        where: {
          zipcodeId: zipcodeId,
        },
      });

      if (!zipcodeExists?.zipcodeId) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              zipcodeId: [
                "The provided zipcodeId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }

      const foodTagExists = foodTag.map((tag) =>
        prisma.foodTag.findUnique({
          where: {
            foodTagId: tag,
          },
        })
      );
      const resolvedFoodTags = await Promise.all(foodTagExists);
      let isNullValue = false;
      resolvedFoodTags.forEach((tag) =>
        !tag ? (isNullValue = true) : undefined
      );
      if (isNullValue) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              foodTag: [
                "The provided foodtagId does not exist in the database.",
              ],
            },
          },
        });
        return;
      }
      const createRestaurant = prisma.restaurant.create({
        data: {
          restaurantId: restaurantId,
          zipcodeId: zipcodeExists.zipcodeId,
          countryId: countryExists.countryId,
          stateId: stateExists.stateId,
          cityId: cityExists.cityId,
          street: street,
          description: description,
          restaurantName: restaurantName,
          latitude: latitude,
          longitude: longitude,
        },
      });
      const createRestaurant_FoodTag = resolvedFoodTags.map((tag) =>
        prisma.restaurant_FoodTag.createMany({
          data: {
            FoodTagId: tag?.foodTagId!,
            RestaurantId: restaurantId,
          },
        })
      );
      const createRestaurant_ImageUrl = imageUrl.map((url) =>
        prisma.restaurant_Image_Url.createMany({
          data: {
            restaurantId: restaurantId,
            imageUrl: url,
          },
        })
      );
      await prisma.$transaction([
        createRestaurant,
        ...createRestaurant_FoodTag,
        ...createRestaurant_ImageUrl,
      ]);
      res.status(201).json({ created: true, restaurantId: restaurantId });
    }

    if (req.method == "GET") {
      const { country, zipcode, state, city, latitude, longitude } = req.query;

      if (!state && !city && !zipcode && !country && !latitude && !longitude) {
        res.status(400).json({
          apiErrors: {
            validationErrors: {
              zipcode: [
                "please provide value for either zipcode & country or country, state & city",
              ],
              city: [
                "please provide value for either zipcode & country or country, state & city",
              ],
              coordinates: [
                "please provide value for latitude and longitude in the query parameters",
              ],
            },
          },
        });
        return;
      }
      // at this point we either have latitude & longitude or zipcode or city
      // latitude and longitude are defined
      if (latitude && longitude) {
        if (typeof latitude !== "string" || typeof longitude !== "string") {
          res.status(400).json({
            apiErrors: {
              validationErrors: {
                coordinates: [
                  "please provide value for latitude and longitude as string",
                ],
              },
            },
          });
          return;
        }
        // using regex, chekc if we have valid coordinates then convert them to numbers
        const isValidLat = isValidCoordinate(latitude);
        const isValidLng = isValidCoordinate(longitude);

        if (!isValidLat || !isValidLng) {
          res.status(400).json({
            apiErrors: {
              validationErrors: {
                coordinates: [
                  "incorrect latitude and longitude values recieved",
                ],
              },
            },
          });
          return;
        }
        // check values in proper lat and lng range after converting them to float
        const floatLat = parseFloat(latitude);
        const floatLng = parseFloat(longitude);
        const validRangeLat = z.number().gte(-90).lte(90).safeParse(floatLat);
        const validRangeLng = z.number().gte(-180).lte(180).safeParse(floatLng);
        if (!validRangeLat.success || !validRangeLng.success) {
          res.status(400).json({
            apiErrors: {
              validationErrors: {
                coordinates: [
                  "latitude should be in range from -90 to 90 and longitude lavlues should be in the range of -180 to 180",
                ],
              },
            },
          });
          return;
        }
        //[minLat, minLng, maxLat, maxLng] in degree
        //const searchRadiusInMiles = 400;
        const coordinates = boundingBoxCalc(
          floatLat,
          floatLng,
          search_radius_miles_backend
        );

        const minLat = coordinates[0];
        const maxLat = coordinates[2];
        const minLng = coordinates[1];
        const maxLng = coordinates[3];

        // restaurantBySearchRadius uses group_concat sql function which returns a distinct comma separated list as string, this applies to imageUrl and foodtags.
        const restaurantsBySearchRadiusOne: RestaurantBySearchRadius =
          await prisma.$queryRaw`select Restaurant.restaurantId ,Restaurant.restaurantName, Restaurant.description, Restaurant.latitude, Restaurant.longitude, Restaurant.street, Country.countryName, State.stateName, City.cityName, Zipcode.zipcode, GROUP_CONCAT(distinct Restaurant_Image_Url.imageUrl) as imageUrl, GROUP_CONCAT(DISTINCT FoodTag.name) as foodTag
            from Restaurant
            join Country
            on Restaurant.countryId=Country.countryId
            join State
            on Restaurant.stateId=State.stateId
            join City
            on Restaurant.cityId=City.cityId
            join Zipcode
            on Restaurant.ZipcodeId=Zipcode.zipcodeId
            join Restaurant_Image_Url
            on Restaurant.restaurantId= Restaurant_Image_Url.restaurantId
            join Restaurant_FoodTag
            on Restaurant.restaurantId= Restaurant_FoodTag.restaurantId
            join FoodTag
            on FoodTag.foodTagId = Restaurant_FoodTag.FoodTagId
            where
            Restaurant.latitude between ${minLat} and ${maxLat}
            and
            Restaurant.longitude between ${minLng} and ${maxLng}
            and 
            ST_Distance_Sphere(point(${floatLng}, ${floatLat}), point( Restaurant.longitude, Restaurant.latitude)) * 0.000621371 < ${search_radius_miles_backend}
            GROUP BY Restaurant.restaurantId;`;

        const restaurants = restaurantsBySearchRadiusOne.map((restaurant) => {
          const imageUrl = restaurant.imageUrl.split(",");
          const coverImageUrlList: string[] = [];
          const otherImageUrlList: string[] = [];
          imageUrl.forEach((item) => {
            if (item.includes("cover")) {
              coverImageUrlList.push(item);
            } else {
              otherImageUrlList.push(item);
            }
          });
          const coverImageUrl = coverImageUrlList[0];
          return {
            restaurantId: restaurant.restaurantId,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude,
            restaurantName: restaurant.restaurantName,
            description: restaurant.description,
            street: restaurant.street,
            country: restaurant.countryName,
            state: restaurant.stateName,
            city: restaurant.cityName,
            zipcode: restaurant.zipcode,
            FoodTag: restaurant.foodTag.split(","),
            coverImageUrl: coverImageUrl,
            otherImageUrlList,
          };
        });

        const geojson = dataToGeoJson(restaurants);

        res.status(200).send({ restaurants: geojson });

        // We either have zipcode or city
      } else {
        if (typeof country !== "string") {
          res.status(400).json({
            apiErrors: {
              validationErrors: {
                country: ["please provide value for country as string"],
              },
            },
          });
          return;
        }
        const countryExists = await prisma.country.findUnique({
          where: {
            countryName: country as string,
          },
        });

        if (!countryExists?.countryId) {
          res.status(400).json({
            apiErrors: {
              validationErrors: {
                country: [
                  "Country does not exist in the database with the name provided",
                ],
              },
            },
          });
          return;
        }
        // search by zipcode
        if (zipcode && zipcode.length > 1) {
          const isTypeCorrect = FilterRestaurantsByZipcodeSchema.safeParse(
            req.query
          );
          if (!isTypeCorrect.success) {
            console.log(isTypeCorrect.error);
            res.status(400).json({
              apiErrors: {
                validationErrors: {
                  country: [
                    "Typecheck failed on the server, provide country and zipcode value as string",
                  ],
                  zipcode: [
                    "Typecheck failed on the server, provide country and zipcode value as string",
                  ],
                },
              },
            });
            return;
          }
          const queryProps = req.query as FilterRestaurantsByZipcode;
          // send data by zipcode
          const zipcodeExists = await prisma.zipcode.findUnique({
            where: {
              zipcode_countryId: {
                zipcode: queryProps.zipcode,
                countryId: countryExists.countryId,
              },
            },
          });
          if (!zipcodeExists?.zipcodeId) {
            res.status(400).json({
              apiErrors: {
                validationErrors: {
                  zipcode: [
                    "The zipcode does not exist in relation to country value provided",
                  ],
                },
              },
            });
            return;
          }
          // find restaurants by zipcde and countryId
          const restaurants = await filterRestaurants({
            zipcodeId: zipcodeExists.zipcodeId,
            countryId: countryExists.countryId,
          });

          res.status(200).send({ restaurants: restaurants });
          return;
        } else {
          // search by city
          const isTypeCorrect = FilterRestaurantsByCitySchema.safeParse(
            req.query
          );
          if (!isTypeCorrect.success) {
            console.log(isTypeCorrect.error);
            res.status(400).json({
              apiErrors: {
                validationErrors: {
                  city: [
                    "Please provide query as city, state and country values as string",
                  ],
                },
              },
            });
            return;
          }
          const queryProps = req.query as FilterRestaurantsByCity;
          const stateExists = await prisma.state.findUnique({
            where: {
              countryId_stateName: {
                countryId: countryExists?.countryId,
                stateName: capitalizeFirstWord(queryProps.state),
              },
            },
          });
          if (!stateExists?.stateId) {
            res.status(400).json({
              apiErrors: {
                validationErrors: {
                  state: [
                    "The state does not exist in relation to country value provided",
                  ],
                },
              },
            });
            return;
          }
          const cityExists = await prisma.city.findUnique({
            where: {
              countryId_stateId_cityName: {
                countryId: countryExists.countryId,
                stateId: stateExists.stateId,
                cityName: capitalizeFirstWord(queryProps.city),
              },
            },
          });
          if (!cityExists?.cityId) {
            res.status(400).json({
              apiErrors: {
                validationErrors: {
                  city: [
                    "The city does not exist in relation to country and state value provided",
                  ],
                },
              },
            });
            return;
          }
          const restaurants = await filterRestaurants({
            countryId: countryExists.countryId,
            stateId: stateExists.stateId,
            cityId: cityExists.cityId,
          });
          res.status(200).send({ restaurants: restaurants });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      apiErrors: { generalErrors: ["something went wrong with the server"] },
    });
  }
}
