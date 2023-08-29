import { prisma } from "@/db/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { ResponseGetAllGeog } from "@/utils/types";

export default async function GetGeographyInputs(
  req: NextApiRequest,
  res: NextApiResponse<ResponseGetAllGeog>
) {
  // get zipcode
  const zipcode = await prisma.zipcode.findMany({
    select: {
      zipcode: true,
      Country: {
        select: { countryName: true },
      },
    },
  });
  const mappedZipcode = zipcode.map(
    (item) => `${item.zipcode}, ${item.Country.countryName}`
  );
  //get city
  const city = await prisma.city.findMany({
    select: {
      cityName: true,
      State: {
        select: { stateName: true },
      },
      Country: {
        select: { countryName: true },
      },
    },
  });
  const mappedCity = city.map(
    (item) =>
      `${item.cityName}, ${item.State.stateName}, ${item.Country.countryName}`
  );
  res.status(200).send({ zipcode: mappedZipcode, city: mappedCity });
}
