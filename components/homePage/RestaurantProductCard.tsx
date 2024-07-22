import * as React from "react";
import { Card, Image, Title, Text, Flex, Box, Badge } from "@mantine/core";
import Link from "next/link";

// TODO: fix typing
type RestaurantProductCardProps = {
  listRestaurants: any[];
};

// TODO: it gives a warning in concosle check top level render of flex. If I comment out the mapping code, it works fine
// further investigation needed
export const RestaurantProductCard: React.FC<RestaurantProductCardProps> = ({
  listRestaurants,
}) => {
  return (
    <Flex direction={"row"} style={{ overflow: "auto" }} gap="md">
      {listRestaurants.map((restaurant) => (
        <Card
          component={Link}
          href={`/restaurants/${restaurant.restaurantId}`}
          style={{ minWidth: 280, maxWidth: 400, maxHeight: 300 }}
          shadow="sm"
          radius="0"
          withBorder
        >
          <Card.Section style={{ maxHeight: 120, overflow: "hidden" }}>
            <Image
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
              alt="Avatar"
            />
          </Card.Section>
          <Title pt="xs" order={1} size={"h5"}>
            {restaurant.restaurantName}
          </Title>
          <Text size="xs" mb="xs" mt="xs" color="dimmed">
            {`${restaurant.street}, ${restaurant.city}, ${restaurant.state}, ${restaurant.zipcode}, ${restaurant.country}`}
          </Text>
          <Flex wrap="wrap" gap="xs" direction={"row"}>
            {restaurant.FoodTag.map((tag: any) => (
              <Badge color="red" size="md">
                {tag}
              </Badge>
            ))}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};
