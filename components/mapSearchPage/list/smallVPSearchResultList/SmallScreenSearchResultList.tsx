import * as React from "react";
import {
  Box,
  SimpleGrid,
  Group,
  Card,
  Image,
  Title,
  Text,
  Flex,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { SmallScreenGeolocationCard } from "./SmallScreenGeolocationCard";
import { SmallScreenToggleMapButton } from "../../map/SmallScreenToggleMapButton";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

export type SmallScreenSearchResultListProps = {
  setToggleSmallScreenMap: (val: boolean) => void;
  toggleSmallScreenMap: boolean;
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonPropertiesRestaurant
  >;
};

export const SmallScreenSearchResultList: React.FC<
  SmallScreenSearchResultListProps
> = ({ setToggleSmallScreenMap, toggleSmallScreenMap, geolocations }) => {
  const smallScreenToggleMapButton = {
    setToggleSmallScreenMap,
    toggleSmallScreenMap,
  };
  return geolocations.features.length > 0 ? (
    <Box>
      <Flex justify="center" gap="xs" wrap={"wrap"}>
        {geolocations.features.map((location, index) => {
          return (
            <>
              <Card
                key={index}
                style={{ minWidth: 280, maxWidth: 300, maxHeight: 300 }}
                shadow="sm"
                radius="0"
                withBorder
              >
                <Card.Section style={{ maxHeight: 120, overflow: "hidden" }}>
                  <Image
                    withPlaceholder
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
                    alt="Avatar"
                  />
                </Card.Section>
                <Title pt="xs" order={1} size={"h5"}>
                  {"New York Gyro"}
                </Title>
                <Text size="xs" mb="xs" mt="xs" color="dimmed">
                  {"9952 Zilla ST Nw, Coon Rapids, MN, 55433, U.S.A"}
                </Text>
              </Card>
              <SmallScreenGeolocationCard key={index} location={location} />
            </>
          );
        })}
      </Flex>
      <Group mt={"sm"} position="center">
        <SmallScreenToggleMapButton {...smallScreenToggleMapButton} />
      </Group>
    </Box>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
