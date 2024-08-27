import * as React from "react";
import Link from "next/link";
import { Card, Title, Flex, Image, Badge, Text } from "@mantine/core";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

export type SmallScreenGeolocationCardProps = {
  location: GeoJSON.Feature<GeoJSON.Geometry, GeoJsonPropertiesRestaurant>;
};
export const SmallScreenGeolocationCard: React.FC<
  SmallScreenGeolocationCardProps
> = ({ location }) => {
  const { properties } = location;
  const {
    restaurantId,
    restaurantName,
    street,
    city,
    state,
    country,
    zipcode,
    description,
    FoodTag,
    coverImageUrl,
    otherImageUrlList,
  } = properties;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;
  const image = `${baseUrl}/${coverImageUrl}`;
  return (
    <Card
      component={Link}
      href={`/restaurants/${restaurantId}`}
      style={{
        minWidth: 280,
        maxWidth: 300,
        maxHeight: 300,
      }}
      shadow="sm"
      radius="0"
      withBorder
      target="_blank"
    >
      <Card.Section style={{ maxHeight: 120, overflow: "hidden" }}>
        <Image
          withPlaceholder
          src={image}
          alt="picture of a dish in restaurant"
        />
      </Card.Section>
      <Title pt="xs" order={1} size={"h5"}>
        {restaurantName}
      </Title>
      <Text size="xs" mb="xs" mt="xs" color="dimmed">
        {`${street}, ${city}, ${state}, ${zipcode}, ${country}`}
      </Text>
      <Flex wrap="wrap" gap="xs" direction={"row"}>
        {FoodTag.map((tag: any) => (
          <Badge key={tag} color="red" size="md">
            {tag}
          </Badge>
        ))}
      </Flex>
    </Card>
  );
};
