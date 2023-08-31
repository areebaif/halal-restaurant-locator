import { Card, Flex, Title, Text, Badge } from "@mantine/core";
import { useMap } from "react-map-gl";
import { GeoJsonRestaurantProps } from "@/utils/types";
type SearchResultListProps = {
  geolocations: GeoJSON.FeatureCollection<
    GeoJSON.Geometry,
    GeoJsonRestaurantProps
  >;
};

export const SearchResultList: React.FC<SearchResultListProps> = ({
  geolocations,
}) => {
  return (
    <Flex direction="column">
      {geolocations.features.map((location, index) => {
        return <GeoLocationCard key={index} location={location} />;
      })}
    </Flex>
  );
};
type GeoLocationCard = {
  location: GeoJSON.Feature<GeoJSON.Geometry, GeoJsonRestaurantProps>;
};

const GeoLocationCard: React.FC<GeoLocationCard> = ({ location }) => {
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
  const onMouseOver = () => {
    const coordinatesObject = location.geometry as GeoJSON.Point;
    const coordinates = coordinatesObject.coordinates.slice();
    const centre = MapA?.getCenter();
    if (centre?.lng !== coordinates[0] && centre?.lat !== coordinates[1]) {
      MapA?.flyTo({ center: [coordinates[0], coordinates[1]] });
    }
  };
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder
      onMouseOver={onMouseOver}
      style={{
        overflow: "inherit",
        margin: "15px 0 0 0",
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
