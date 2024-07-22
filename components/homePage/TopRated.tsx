import * as React from "react";
import { Title, MediaQuery, Divider } from "@mantine/core";
import { RestaurantProductCard } from "./RestaurantProductCard";

export const TopRated: React.FC = () => {
  // TODO: we will have a backend query that returns a list that we loop over for now lets use dummy data

  const testRestaurants = [
    {
      restaurantName: "New York Gyro",
      description:
        "Falafel, gyros & other Middle Eastern dishes are offered at this eatery.",
      latitude: "45.0524454",
      longitude: "-93.2495228",
      street: "4621 Central Ave NE",
      city: "Minneapolis",
      state: "Minnesota",
      zipcode: "55433",
      country: "U.S.A",
      FoodTag: ["Middle Easter", "Indian", "Pakistani"],
      restaurantId: "7923b6c0-a3c4-49e2-a554-0dea75422076",
      //concat: `${street}, ${city}, ${state}, ${zipcode}, ${country}`,
    },
    {
      restaurantName: "Halal Peri Peri Chicken & Grill",
      description: "Pakistani Morrocan dishes are served at this eatery.",
      latitude: "45.0524454",
      longitude: "-93.2495228",
      street: "4621 Central Ave NE",
      city: "Minneapolis",
      state: "Minnesota",
      zipcode: "55433",
      country: "U.S.A",
      FoodTag: ["Morrocon", "Pakistani"],
      restaurantId: "7923b6c0-a3c4-49e2-a554-0dea75422076",
    },
    {
      restaurantName: "Halal Peri Peri Chicken & Grill",
      description: "Pakistani Morrocan dishes are served at this eatery.",
      latitude: "45.0524454",
      longitude: "-93.2495228",
      street: "4621 Central Ave NE",
      city: "Minneapolis",
      state: "Minnesota",
      zipcode: "55433",
      country: "U.S.A",
      FoodTag: ["Morrocon", "Pakistani"],
      restaurantId: "7923b6c0-a3c4-49e2-a554-0dea75422076",
    },
    {
      restaurantName: "Halal Peri Peri Chicken & Grill",
      description: "Pakistani Morrocan dishes are served at this eatery.",
      latitude: "45.0524454",
      longitude: "-93.2495228",
      street: "4621 Central Ave NE",
      city: "Minneapolis",
      state: "Minnesota",
      zipcode: "55433",
      country: "U.S.A",
      FoodTag: ["Morrocon", "Pakistani"],
      restaurantId: "7923b6c0-a3c4-49e2-a554-0dea75422076",
    },
  ];

  return (
    <>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Title mt="lg" size={"h2"} order={1}>
          {" "}
          Recently added
        </Title>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Title pt="lg" mt="lg" size={"h3"} order={1}>
          {" "}
          Recently added
        </Title>
      </MediaQuery>
      <Divider my="sm" />
      <RestaurantProductCard listRestaurants={testRestaurants} />
    </>
  );
};
