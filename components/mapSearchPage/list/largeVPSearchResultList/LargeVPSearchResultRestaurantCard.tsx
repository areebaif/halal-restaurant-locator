import * as React from "react";
import Link from "next/link";
import { useMap } from "react-map-gl";

import { Card, Flex, Title, Text, Badge, Image } from "@mantine/core";
import { PopupDataProps } from "../../map/MapContainer";
import { map_source_data_id_client } from "@/utils/constants";
import { GeoJsonPropertiesRestaurant } from "@/utils/types";

export type LargeVPGeolocationCardProps = {
  location: GeoJSON.Feature<GeoJSON.Geometry, GeoJsonPropertiesRestaurant>;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
  showPopup: boolean;
  setShowPopup: (val: boolean) => void;
  popupData: PopupDataProps;
  setPopupData: (data: PopupDataProps) => void;
};

export const LargeVPGeolocationCard: React.FC<LargeVPGeolocationCardProps> = ({
  location,
  hoverId,
  setHoverId,
  setShowPopup,
  setPopupData,
}) => {
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
  const onMouseEnter = () => {
    // centre the map on the hovered location
    const coordinatesObject = location.geometry as GeoJSON.Point;
    const coordinates = coordinatesObject.coordinates.slice();
    const centre = MapA?.getCenter();
    if (centre?.lng !== coordinates[0] && centre?.lat !== coordinates[1]) {
      MapA?.flyTo({ center: [coordinates[0], coordinates[1]] });
    }
    // get the relevant data to show popup
    if (hoverId !== location.id) {
      const coordinatesObject = location.geometry as GeoJSON.Point;
      const coordinates = coordinatesObject.coordinates.slice();
      const description = location.properties?.description;
      const restaurantName = location.properties?.restaurantName;
      const restaurantId = location.properties?.restaurantId;
      const street = location.properties?.street;
      const city = location.properties?.city;
      const state = location.properties?.state;
      const zip = location.properties?.zipcode;
      const country = location.properties?.country;
      const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;
      const coverImageUrl = location.properties?.coverImageUrl;

      const id = location.id;
      MapA?.setFeatureState(
        { source: map_source_data_id_client, id: id },
        { hover: true }
      );
      setHoverId(id);
      setPopupData({
        restaurantId,
        restaurantName,
        address,
        description,
        latitude: coordinates[1],
        longitude: coordinates[0],
        coverImageUrl: coverImageUrl,
      });
      setShowPopup(true);
    }
  };

  const onMouseLeave = () => {
    MapA?.setFeatureState(
      { source: map_source_data_id_client, id: location.id },
      { hover: false }
    );
    setHoverId(undefined);
    setShowPopup(false);
    setPopupData({
      restaurantId: "",
      restaurantName: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      coverImageUrl: "",
    });
  };
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
