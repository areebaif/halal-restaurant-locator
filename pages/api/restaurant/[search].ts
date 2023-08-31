import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
// local imports
import { prisma } from "@/db/prisma";
import {
  findRestaurant,
  capitalizeFirstWord,
  parseQueryVals,
  GetSearchInputsZod,
} from "@/utils";
import {
  GetSearchInputs,

  ResponseRestaurantGeoJson,
} from "@/utils/types";

export default async function MapSearch(
  req: NextApiRequest,
  res: NextApiResponse<ResponseRestaurantGeoJson>
) {
  try {
    const { search } = req.query;

    const isQueryCorrect = z.string().safeParse(search);
    if (!isQueryCorrect.success) {
      console.log(isQueryCorrect.error);
      res.json({ typeError: "expected query param as string" });
      return;
    }
    const searchData = parseQueryVals(search as string);
    const isTypeCorrect = GetSearchInputsZod.safeParse(searchData);
    if (!isTypeCorrect.success) {
      console.log(isTypeCorrect.error);
      res.json({
        typeError:
          "type check failed on the server, expected to an objects with countryName as string, and either zipcode as string or restaurantName as string or stateName, cityName, as string",
      });
      return;
    }

    const queryProps = searchData as GetSearchInputs;
    const { country, state, city, zipcode, restaurantName } = queryProps;

    if (!state && !city && !restaurantName && !zipcode) {
      res.json({
        typeError:
          "type check failed on the server, you need to define either zipcode & countryName or stateName, cityName & countryName or restaurantName & country.",
      });
      return;
    }
    const countryExists = await prisma.country.findUnique({
      where: {
        countryName: country,
      },
    });
    if (!countryExists?.countryId) {
      res.json({
        country: "The provided countryName doesnot exist in the database",
      });
      return;
    }
    // search by zipcode
    if (zipcode.length > 1) {
      // send data by zipcode
      const zipcodeExists = await prisma.zipcode.findUnique({
        where: {
          zipcode_countryId: {
            zipcode: zipcode,
            countryId: countryExists.countryId,
          },
        },
      });
      if (!zipcodeExists?.zipcodeId) {
        res.json({
          zipcode:
            "The provided zipcode in reference to countryId doesnot exist in the database",
        });
        return;
      }
      // find restaurants by zipcde and countryId
      const restaurants = await findRestaurant({
        zipcodeId: zipcodeExists.zipcodeId,
        countryId: countryExists.countryId,
      });

      res.status(200).send({ restaurants: restaurants });
      return;
    }
    // search by city
    if (city.length > 1) {
      const stateExists = await prisma.state.findUnique({
        where: {
          countryId_stateName: {
            countryId: countryExists?.countryId,
            stateName: capitalizeFirstWord(state),
          },
        },
      });
      if (!stateExists?.stateId) {
        res.json({
          state:
            "The provided stateName inreference to countryId doesnot exist in the database",
        });
        return;
      }
      const cityExists = await prisma.city.findUnique({
        where: {
          countryId_stateId_cityName: {
            countryId: countryExists.countryId,
            stateId: stateExists.stateId,
            cityName: capitalizeFirstWord(city),
          },
        },
      });
      if (!cityExists?.cityId) {
        res.json({
          city: "The provided cityName in reference to countryId and stateName doesnot exist in the database",
        });
        return;
      }
      const restaurants = await findRestaurant({
        countryId: countryExists.countryId,
        stateId: stateExists.stateId,
        cityId: cityExists.cityId,
      });
      res.status(200).send({ restaurants: restaurants });
      return;
    }

    // search by restaurant name
    if (restaurantName.length > 1) {
      const restaurantExists = await findRestaurant({
        restaurantName: restaurantName,
      });
      if (!restaurantExists?.length) {
        res.json({
          restaurantError: "no value exists with the restaurant name provided",
        });
        return;
      }
      res.status(200).send({ restaurants: restaurantExists });
      return;
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ restaurantError: "something went wrong with the server" });
  }
}
