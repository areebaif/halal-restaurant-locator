import * as React from "react";
import Link from "next/link";
import { useMap } from "react-map-gl";
import { Carousel } from "@mantine/carousel";
import { Card, Text, Box, Image, Title, Badge } from "@mantine/core";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

type SearchResultCarousolProps = {
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
};

export const SearchResultCarousol: React.FC<SearchResultCarousolProps> = ({
  geolocations,
  hoverId,
  setHoverId,
}) => {
  return (
    <Carousel maw={320} mx="auto" height={170}>
      {geolocations.features.map((location, index) => {
        return (
          <Carousel.Slide>
            <SearchResultCarousolCard
              location={location}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          </Carousel.Slide>
        );
      })}
      <Carousel.Slide>
        <Box
          sx={(theme) => ({
            backgroundColor: "white",
            height: "100%",
            textAlign: "center",
            padding: theme.spacing.xl,
            borderRadius: theme.radius.md,
            cursor: "pointer",

            // "&:hover": {
            //   backgroundColor:
            //     theme.colorScheme === "dark"
            //       ? theme.colors.dark[5]
            //       : theme.colors.gray[1],
            // },
          })}
        >
          Box lets you add inline styles with sx prop
        </Box>
      </Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
      {/* ...other slides */}
    </Carousel>
  );
};

type SearchResultCarousolCardProps = {
  location: GeoJSON.Feature<GeoJSON.Geometry, GeoJsonPropertiesRestaurant>;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
};

export const SearchResultCarousolCard: React.FC<
  SearchResultCarousolCardProps
> = ({ location, hoverId, setHoverId }) => {
  const { MapA } = useMap();
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
    imageUrl,
  } = properties;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;
  const image = `${baseUrl}/${imageUrl[0]}`;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: "white",
        height: "100%",
        padding: theme.spacing.xl,
        borderRadius: theme.radius.md,
        cursor: "pointer",

        // "&:hover": {
        //   backgroundColor:
        //     theme.colorScheme === "dark"
        //       ? theme.colors.dark[5]
        //       : theme.colors.gray[1],
        // },
      })}
    >
      {/* <Card.Section>
        <Image src={image} height={160} alt="cover image for restaurant" />
      </Card.Section> */}
      <Title order={4}>{restaurantName}</Title>
      <Text size="xs" color="dimmed">
        {`${street}, ${city}, ${state}, ${zipcode}, ${country}`}
      </Text>
      {FoodTag.map((badge, index) => {
        return (
          <Badge key={index} mt="xs" size="xs">
            {badge}
          </Badge>
        );
      })}
    </Box>
  );
};
