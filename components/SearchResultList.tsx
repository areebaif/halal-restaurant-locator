import { Card, Flex, Title, Text, Badge } from "@mantine/core";
import { useMap } from "react-map-gl";
import { GeoJsonRestaurantProperties } from "@/utils/types";
import { ErrorCard } from ".";
import { MapContainerProps, PopupDataProps } from "./MapContainer";

export const SearchResultList: React.FC<MapContainerProps> = ({
  geolocations,
  hoverId,
  setHoverId,
  showPopup,
  setShowPopup,
  popupData,
  setPopupData,
}) => {
  const geoLocationCardProps = {
    hoverId,
    setHoverId,
    showPopup,
    setShowPopup,
    popupData,
    setPopupData,
  };
  return geolocations.features.length > 0 ? (
    <Flex direction="column">
      {geolocations.features.map((location, index) => {
        return (
          <GeoLocationCard
            key={index}
            location={location}
            {...geoLocationCardProps}
          />
        );
      })}
    </Flex>
  ) : (
    <ErrorCard message="This location has no data" />
  );
};
type GeoLocationCard = {
  location: GeoJSON.Feature<GeoJSON.Geometry, GeoJsonRestaurantProperties>;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
  showPopup: boolean;
  setShowPopup: (val: boolean) => void;
  popupData: PopupDataProps;
  setPopupData: (data: PopupDataProps) => void;
};

const GeoLocationCard: React.FC<GeoLocationCard> = ({
  location,
  hoverId,
  setHoverId,
  setShowPopup,
  setPopupData,
}) => {
  const { MapA } = useMap();
  const { properties } = location;
  const {
    restaurantName,
    street,
    city,
    state,
    country,
    zipcode,
    description,
    FoodTag,
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
      const street = location.properties?.street;
      const city = location.properties?.city;
      const state = location.properties?.state;
      const zip = location.properties?.zipcode;
      const country = location.properties?.country;
      const address = `${street}, ${city}, ${state}, ${zip}, ${country}`;
      const id = location.id;
      MapA?.setFeatureState(
        { source: "restaurant locations", id: id },
        { hover: true }
      );
      setHoverId(id);
      setPopupData({
        restaurantName,
        address,
        description,
        latitude: coordinates[1],
        longitude: coordinates[0],
      });
      setShowPopup(true);
    }
  };

  const onMouseLeave = () => {
    MapA?.setFeatureState(
      { source: "restaurant locations", id: location.id },
      { hover: false }
    );
    setShowPopup(false);
    setPopupData({
      restaurantName: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
    });
  };
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        overflow: "inherit",
        margin: "5px 0 0 0",
      }}
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
      <Text pt="md" size="xs" color="dimmed">
        {description}
      </Text>
    </Card>
  );
};
