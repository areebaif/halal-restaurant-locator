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

  return (
    <Carousel
      maw={300}
      miw={300}
      height={170}
      controlsOffset="xs"
      controlSize={20}
      initialSlide={0}
      loop
      onSlideChange={(index) => {
        const coordinatesObject = geolocations.features[index]
          .geometry as GeoJSON.Point;
        const coordinates = coordinatesObject.coordinates.slice();
        const centre = MapA?.getCenter();
        if (centre?.lng !== coordinates[0] && centre?.lat !== coordinates[1]) {
          MapA?.flyTo({ center: [coordinates[0], coordinates[1]] });
        }
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

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: "white",
        height: "100%",
        borderRadius: theme.radius.md,
        cursor: "pointer",
        paddingTop: theme.spacing.md,
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
            paddingBottom: theme.spacing.sm,
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
        <Card.Section ml="xs" mr="xs">
          <Image
            src={`${baseUrl}/${coverImageUrl}`}
            height={160}
            alt="cover image for restaurant"
          />
        </Card.Section>
        {otherImageUrlList?.map((url, index) => (
          <Card.Section ml="xs" mr="xs" mt="xs" key={index}>
            <Image
              src={`${baseUrl}/${url}`}
              height={160}
              alt="cover image for restaurant"
            />
          </Card.Section>
        ))}
      </ScrollArea>
    </Box>
  );
};
