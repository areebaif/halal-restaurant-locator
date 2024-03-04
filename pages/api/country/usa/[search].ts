import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hasNumbers } from "@/utils";

export default async function GeographySearch(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { search } = req.query;
    const isQueryParamCorrect = z.string().safeParse(search);
    if (!isQueryParamCorrect.success) {
      console.log(isQueryParamCorrect.error);
      res
        .status(400)
        .json({ apiErrors: { typeError: "expected query param as string" } });
      return;
    }
    const stringQuery = search as string;
    const isZipcode = hasNumbers(stringQuery);
    const country = await prisma.country.findUnique({
      where: { countryName: "U.S.A" },
    });
    if (isZipcode) {
      // the search is a zipcode or invalid zipcode
      const zipcodeSplit = stringQuery.split("=");
      const zipcodeVal = zipcodeSplit[1];
      const zipcode = await prisma.zipcode.findMany({
        where: {
          zipcode: {
            startsWith: zipcodeVal,
          },
        },
        select: {
          zipcodeId: true,
          zipcode: true,
          latitude: true,
          longitude: true,
          Country: {
            select: { countryName: true, countryId: true },
          },
          State: {
            select: { stateName: true, stateId: true },
          },
          City: {
            select: { cityName: true, cityId: true },
          },
        },
      });
      const mappedZipcode = zipcode.map((item) => ({
        zipcodeId: item.zipcodeId,
        stateName: item.State.stateName,
        cityName: item.City.cityName,
        zipcode: item.zipcode,
        latitude: item.latitude,
        longitude: item.longitude,
        //country: item.Country.countryName,
      }));
      res.status(200).send({
        zipcode: mappedZipcode,
        country: {
          countryId: country?.countryId!,
          countryName: country?.countryName!,
        },
      });
    } else {
      // the search is a city name or invalid city name
      const citySplit = stringQuery.split("=");
      const cityVal = citySplit[1];
      const city = await prisma.city.findMany({
        where: {
          cityName: {
            startsWith: cityVal,
          },
        },
        select: {
          cityId: true,
          cityName: true,
          State: {
            select: { stateName: true, stateId: true },
          },
          Country: {
            select: { countryName: true, countryId: true },
          },
        },
      });
      const mappedCity = city.map((item) => ({
        cityId: item.cityId,
        stateName: item.State.stateName,
        cityName: item.cityName,
        //country: item.Country.countryName,
      }));
      res.status(200).send({
        city: mappedCity,
        country: {
          countryId: country?.countryId!,
          countryName: country?.countryName!,
        },
      });
    }
  } catch (err) {}
}
