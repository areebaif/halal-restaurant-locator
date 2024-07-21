import * as React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Loader,
  Title,
  SimpleGrid,
  Text,
  Badge,
  MediaQuery,
  Flex,
  Divider,
  UnstyledButton,
} from "@mantine/core";
import { ErrorCard, AllImages } from "@/components";
import { getRestaurantById } from "@/utils";
import { GetRestaurant, GetRestaurantError } from "@/utils/types";
import { IconBrandGoogle } from "@tabler/icons-react";
import { RestaurantProductCard } from "@/components/homePage/RestaurantProductCard";

//TODO: add google search result link
// TODO: create api to get similar restaurants in the area

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
  },
];

export const RestaurantProduct: React.FC = () => {
  const router = useRouter();
  const restaurant = router.query.restaurantId;
  const restaurantId = restaurant as string;
  const getRestaurant = useQuery(
    ["getRestaurantById", restaurantId],
    () => getRestaurantById(restaurantId),
    {
      enabled: restaurantId ? true : false,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  if (getRestaurant.isLoading) return <Loader />;
  if (getRestaurant.isError)
    return <ErrorCard message="something went wrong please try again" />;
  const data = getRestaurant.data;
  if (data.hasOwnProperty("apiErrors")) {
    const errors = data as GetRestaurantError;
    if (errors.apiErrors?.validationErrors)
      return (
        <ErrorCard
          arrayOfErrors={errors.apiErrors?.validationErrors.restaurantId}
        />
      );
    if (errors.apiErrors?.generalError)
      <ErrorCard arrayOfErrors={errors.apiErrors?.generalError} />;
  }
  // it is safe to assume we have the restaurant data
  const restaurantData = data as GetRestaurant;
  return (
    <>
      <SimpleGrid
        spacing={0}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { minWidth: "sm", cols: 2, spacing: "xl" },
        ]}
      >
        <AllImages listImageUrls={restaurantData.imageUrl} />
        <RestaurantDetails restaurantData={restaurantData} />
      </SimpleGrid>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Title mt="md" pt="md" size={"h2"} order={1}>
          {" "}
          Similar restaurants in the area
        </Title>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Title mt="sm" pt="sm" size={"h3"} order={1}>
          {" "}
          Similar restaurants in the area
        </Title>
      </MediaQuery>
      <Divider my="xs" />
      <RestaurantProductCard listRestaurants={testRestaurants} />
    </>
  );
};

type RestauratnDetailProps = {
  restaurantData: GetRestaurant;
};

const RestaurantDetails: React.FC<RestauratnDetailProps> = ({
  restaurantData,
}) => {
  return (
    <Box>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Title size={"h2"} order={1}>
          {" "}
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Title pt="sm" size={"h3"} order={1}>
          {" "}
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <Text size="xs" color="dimmed">
        {`${restaurantData.street}, ${restaurantData.city}, ${restaurantData.state}, ${restaurantData.zipcode}, ${restaurantData.country}`}
      </Text>
      <UnstyledButton>
        <Text color="blue" size="xs">
          {"  "}
          Google search result link{"  "}
        </Text>
      </UnstyledButton>
      <Divider mt="xs" />

      <Flex wrap="wrap" gap="xs" pt="xs" direction={"row"}>
        {restaurantData.FoodTag.map((tag: any) => (
          <Badge color="red" size="md">
            {tag}
          </Badge>
        ))}
      </Flex>

      <Text size="md" pt="xs">
        {restaurantData.description}
      </Text>
    </Box>
  );
};

export default RestaurantProduct;
