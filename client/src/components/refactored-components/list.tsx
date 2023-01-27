import * as React from "react";
import {
  List,
  Popover,
  Text,
  CloseButton,
  Box,
  ScrollArea,
} from "@mantine/core";
import { useMap } from "react-map-gl";
import { useAppDispatch, useAppSelector } from "../../redux-store/redux-hooks";
import {
  setMapGeolocationCardData,
  setHoverId,
  ActiveGeolocation,
  setIsOpenMapGeolocationCard,
  setIsOpenListGeolocationCard,
} from "../../redux-store/geolocation-slice";

export const ResultList: React.FC = () => {
  const mapInputs = useAppSelector((state) => state.geolocation);
  const {
    allGeolocationsData,
    mapGeoLocationCardData,
    isOpenMapGeolocationCard,
    hoverId,
    dataSourceId,
    isOpenListGeolocationCard,
  } = mapInputs;

  // ReduxToolkit functions
  const dispatch = useAppDispatch();
  // This holds refernece to the map object
  const { MapA } = useMap();

  const onMouseEnter = (data: ActiveGeolocation) => {
    const {
      latitude,
      longitude,
      title,
      description,
      index,
      updated_at,
      image_url,
      menu_url,
      website_url,
      street,
      city,
      state,
      zipcode,
      country,
    } = data;
    if (hoverId) {
      MapA?.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    dispatch(setHoverId(undefined));
    MapA?.setFeatureState({ source: dataSourceId, id: index }, { hover: true });
    dispatch(setHoverId(index));
    dispatch(
      setMapGeolocationCardData({
        latitude: latitude,
        longitude: longitude,
        title: title,
        description: description,
        index: index,
        updated_at,
        image_url,
        menu_url,
        website_url,
        street,
        city,
        state,
        zipcode,
        country,
      })
    );
    // TODO: decide if I want to open this on the map
    //dispatch(setIsOpenMapGeolocationCard(true));
  };

  const onMouseLeave = () => {
    if (!isOpenListGeolocationCard) {
      MapA?.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
      dispatch(setHoverId(undefined));
      dispatch(
        setMapGeolocationCardData({
          latitude: 0,
          longitude: 0,
          title: "",
          description: "",
          index: undefined,
          updated_at: "",
          image_url: [],
          menu_url: "",
          website_url: "",
          street: "",
          city: "",
          state: "",
          zipcode: "",
          country: "",
        })
      );
    }
  };

  const onCloseClick = () => {
    dispatch(setIsOpenListGeolocationCard(false));
    MapA?.setFeatureState(
      { source: dataSourceId, id: hoverId },
      { hover: false }
    );
    dispatch(setHoverId(undefined));
    dispatch(
      setMapGeolocationCardData({
        latitude: 0,
        longitude: 0,
        title: "",
        description: "",
        index: undefined,
        updated_at: "",
        image_url: [],
        menu_url: "",
        website_url: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      })
    );
  };

  const list = (
    <Box>
      <ScrollArea style={{ height: 600 }} type="auto">
        <List
          onMouseLeave={() => {
            //setIsOpenLocationDetail(false);
          }}
          icon={" "}
        >
          {allGeolocationsData.features.map((item) => {
            const coordinatesObject = item.geometry as GeoJSON.Point;
            const [longitude, latitude] = coordinatesObject.coordinates;
            const { properties } = item;
            const {
              title,
              updated_at,
              description,
              image_url,
              menu_url,
              website_url,
              street,
              city,
              state,
              zipcode,
              country,
            } = properties;

            const id = item.id;

            return (
              <List.Item
                onMouseEnter={() => {
                  onMouseEnter({
                    latitude: latitude,
                    longitude: longitude,
                    index: id,
                    title,
                    description,
                    updated_at,
                    image_url,
                    menu_url,
                    website_url,
                    street,
                    city,
                    state,
                    zipcode,
                    country,
                  });
                }}
                onClick={() => {
                  dispatch(setIsOpenListGeolocationCard(true));
                }}
                onMouseLeave={() => {
                  onMouseLeave();
                }}
                key={item.id}
              >
                <Text>
                  {title} {street} {city} {state} {zipcode}{" "}
                </Text>
                image_url: {image_url}, menu_url: {menu_url}, website_url:{" "}
                {website_url}{" "}
              </List.Item>
            );
          })}
        </List>
      </ScrollArea>
    </Box>
  );

  return (
    <Popover
      opened={isOpenListGeolocationCard}
      position={"right"}
      offset={20}
      withArrow={true}
    >
      <Popover.Target>{list}</Popover.Target>
      <Popover.Dropdown>
        <CloseButton onClick={() => onCloseClick()} aria-label="Close modal" />
        <Text>
          title: {mapGeoLocationCardData.title} {mapGeoLocationCardData.street}{" "}
          image_url: {mapGeoLocationCardData.image_url}
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
};
