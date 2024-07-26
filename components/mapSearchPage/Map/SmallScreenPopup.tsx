import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { PopupDataProps } from "./MapContainer";
import { Card, CloseButton, Image, Title, Text, Box } from "@mantine/core";

export type SmallScreenPopupProps = {
  popupData: PopupDataProps;
  setPopupData: (data: PopupDataProps) => void;
  setShowSmallScreenPopup: (val: boolean) => void;
};
export const SmallScreenPopupCard: React.FC<SmallScreenPopupProps> = ({
  popupData,
  setPopupData,
  setShowSmallScreenPopup,
}) => {
  const router = useRouter();
  return (
    <Card
      shadow="sm"
      radius="0"
      withBorder
      style={{ minWidth: 280, maxWidth: 400, maxHeight: 300 }}
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
            setShowSmallScreenPopup(false);
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
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${popupData.coverImageUrl}`}
          alt="picture of a dish in restaurant"
        />
      </Card.Section>
      <Box
        onClick={() => {
          router.push(`/restaurants/${popupData.restaurantId}`);
        }}
        sx={(theme) => ({
          "&:hover": {
            cursor: "pointer",
          },
        })}
      >
        {" "}
        <Title pt="xs" order={1} size={"h5"}>
          {popupData.restaurantName}
        </Title>
        <Text size="xs" mb="xs" color="dimmed">
          {`${popupData.address}`}
        </Text>
      </Box>
    </Card>
  );
};