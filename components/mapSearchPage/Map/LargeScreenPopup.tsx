import * as React from "react";
import { useRouter } from "next/router";
import { useMap } from "react-map-gl";
import {
  Card,
  Image,
  Title,
  Text,
  CloseButton,
  Box,
  Paper,
} from "@mantine/core";
import { PopupDataProps } from "./MapContainer";
import { map_source_data_id_client } from "@/utils/constants";
import Link from "next/link";

export type LargeScreenPopupProps = {
  popupData: PopupDataProps;
  setShowPopup: (val: boolean) => void;
  setPopupData: (data: PopupDataProps) => void;
  hoverId: string | number | undefined;
  setHoverId: (val: string | number | undefined) => void;
};
export const LargeScreenPopup: React.FC<LargeScreenPopupProps> = ({
  popupData,
  setShowPopup,
  setPopupData,
  hoverId,
  setHoverId,
}) => {
  const router = useRouter();
  const { MapA } = useMap();
  return (
    <Card
      shadow="sm"
      radius="0"
      withBorder
      style={{
        marginTop: "-10px",
        marginLeft: "-10px",
        marginRight: "-10px",
        marginBottom: "-15px",
      }}
    >
      <Card.Section style={{ maxHeight: 120, overflow: "hidden" }}>
        <CloseButton
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[2],
            position: "absolute",
            zIndex: 1,
            top: "0",
            right: "0",
          })}
          color="dark"
          radius={0}
          onClick={() => {
            setShowPopup(false);
            MapA?.setFeatureState(
              { source: map_source_data_id_client, id: hoverId },
              { hover: false }
            );
            setHoverId(undefined);
            setPopupData({
              restaurantId: "",
              restaurantName: "",
              description: "",
              address: "",
              latitude: 0,
              longitude: 0,
              coverImageUrl: "",
            });
          }}
        />
        <Image
          withPlaceholder
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${popupData.coverImageUrl}`}
          alt="picture of a dish in restaurant"
        />
      </Card.Section>
      <Paper
        component={Link}
        href={`/restaurants/${popupData.restaurantId}`}
        target="blank"
      >
        <Title pt="xs" order={1} size={"h5"}>
          {popupData.restaurantName}
        </Title>
        <Text size="xs" mb="xs" color="dimmed">
          {`${popupData.address}`}
        </Text>
      </Paper>
    </Card>
  );
};
