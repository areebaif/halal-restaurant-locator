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
  onActiveGeolocationChange,
  onGoelocationDataChange,
  onHoverIdChange,
  onIsOpenActiveGeolocationCardChange,
  onRefreshMapDataChange,
  ActiveGeolocation,
} from "../../redux-store/geolocation-slice";

export const ResultList: React.FC = () => {
  const [isOpenLocationDetail, setIsOpenLocationDetail] = React.useState(false);
  // const onMouseEnter = (data: activeMarkerProps) => {
  //     if (hoverId) {
  //       mapRef.current.setFeatureState(
  //         { source: dataSourceId, id: hoverId },
  //         { hover: false }
  //       );
  //     }
  //     hoverId = undefined;
  //     hoverId = data.index;
  //     setActivePlaceData?.(data);
  //     mapRef.current.setFeatureState(
  //       { source: dataSourceId, id: hoverId },
  //       { hover: true }
  //     );
  //   };

  //   const allListMouseLeave = () => {
  //     // disable hover interactivity on map
  //     if (hoverId) {
  //       mapRef.current.setFeatureState(
  //         { source: dataSourceId, id: hoverId },
  //         { hover: false }
  //       );
  //     }
  //     hoverId = undefined;
  //     // close Popup
  //     setActivePlaceData?.(null);
  //   };

  const mapInputs = useAppSelector((state) => state.geolocation);
  const {
    geolocationData,
    activeGeolocation,
    isOpenActiveGeolocationCard,
    hoverId,
    dataSourceId,
  } = mapInputs;

  // ReduxToolkit functions
  const dispatch = useAppDispatch();

  const { MapA } = useMap();
  const onMouseEnter = (data: ActiveGeolocation) => {
    const { latitude, longitude, title, description, index } = data;
    if (hoverId) {
      MapA?.setFeatureState(
        { source: dataSourceId, id: hoverId },
        { hover: false }
      );
    }
    dispatch(onHoverIdChange(undefined));

    MapA?.setFeatureState({ source: dataSourceId, id: index }, { hover: true });
    dispatch(onHoverIdChange(index));
    // TODO: decide if I want to open this on the map
    // dispatch(
    //   onActiveGeolocationChange({
    //     latitude: latitude,
    //     longitude: longitude,
    //     title: title,
    //     description: description,
    //     index: index,
    //   })
    // );
    // dispatch(onIsOpenActiveGeolocationCardChange(true));
  };
  const list = (
    <Box>
      <ScrollArea style={{ height: 600 }} type="auto">
        <List
          onMouseLeave={() => {
            console.log("mouse leave ran");
          }}
          icon={" "}
        >
          {geolocationData.features.map((item) => {
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
                  // onClick={() => onLocationInfoOpenCard?.(activePlace)}
                  // onMouseLeave={() => {
                  //   mapRef.current.setFeatureState(
                  //     { source: dataSourceId, id: hoverId },
                  //     { hover: false }
                  //   );
                  //   hoverId = undefined;
                  //   // close Popup
                  //   setActivePlaceData?.(null);
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
      opened={isOpenLocationDetail}
      position={"right"}
      offset={20}
      withArrow={true}
    >
      <Popover.Target>{list}</Popover.Target>
      <Popover.Dropdown>
        <CloseButton
          onClick={() => setIsOpenLocationDetail(false)}
          aria-label="Close modal"
        />
        <Text>{/*locationInfoCardData?.index*/ "hello"}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
