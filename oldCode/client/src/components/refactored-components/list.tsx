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
    const { latitude, longitude, title, description, index } = data;
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
            //console.log(properties);
            const id = item.id;

            return (
              <List.Item
                onMouseEnter={() => {
                  onMouseEnter({
                    latitude: latitude,
                    longitude: longitude,
                    index: id,
                    title: "test",
                    description: "dontknow",
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
                {item.properties?.title}
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
        <Text>{mapGeoLocationCardData.index}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
