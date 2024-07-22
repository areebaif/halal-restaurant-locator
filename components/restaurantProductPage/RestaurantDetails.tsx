import * as React from "react";
import { GetRestaurant } from "@/utils/types";
import {
  Box,
  MediaQuery,
  Title,
  Text,
  Badge,
  UnstyledButton,
  Flex,
  Divider,
} from "@mantine/core";

export type RestauratnDetailProps = {
  restaurantData: GetRestaurant;
};

export const RestaurantDetails: React.FC<RestauratnDetailProps> = ({
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
