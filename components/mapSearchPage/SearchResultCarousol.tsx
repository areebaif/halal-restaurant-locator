import * as React from "react";
import Link from "next/link";
import { useMap } from "react-map-gl";
import { Carousel } from "@mantine/carousel";
import {
  Text,
  Box,
  Title,
  Badge,
  Card,
  Image,
  ScrollArea,
} from "@mantine/core";
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
  const { MapA } = useMap();
  console.log(MapA, "slslslslslslsl");
  return (
    <Carousel
      maw={320}
      mx="auto"
      height={170}
      controlsOffset="xs"
      controlSize={20}
      initialSlide={0}
      onSlideChange={(index) => {
        // remove the highlight of the last hover
        // set the hobver to this item, id cannot go below 0
      }}
    >
      {geolocations.features.map((location) => {
        return (
          <Carousel.Slide key={location.id}>
            <SearchResultCarousolCard
              location={location}
              hoverId={hoverId}
              setHoverId={setHoverId}
            />
          </Carousel.Slide>
        );
      })}

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
    coverImageUrl,
    otherImageUrlList,
  } = properties;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;
  const image = `${baseUrl}/${coverImageUrl}`;

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: "white",
        height: "100%",
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
      <ScrollArea h={170}>
        <Box
          sx={(theme) => ({
            paddingTop: theme.spacing.md,
            paddingLeft: `calc(${theme.spacing.sm}*3)`,
            paddingRight: `calc(${theme.spacing.sm}*3)`,
          })}
        >
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
        <Card.Section>
          <Image src={image} height={160} alt="cover image for restaurant" />
        </Card.Section>
      </ScrollArea>
    </Box>
  );
};
