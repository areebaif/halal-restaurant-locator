import * as React from "react";
import { Button, Box } from "@mantine/core";
import { responsive_map_resize_value_pixels } from "@/utils/constants";

type SmallScreenToggleMapButtonProps = {
  setToggleSmallScreenMap: (val: boolean) => void;
  toggleSmallScreenMap: boolean;
};

export const SmallScreenToggleMapButton: React.FC<
  SmallScreenToggleMapButtonProps
> = ({ setToggleSmallScreenMap, toggleSmallScreenMap }) => {
  return (
    <Box
      sx={(theme) => ({
        [theme.fn.largerThan(`${responsive_map_resize_value_pixels}`)]: {
          display: "none",
        },
      })}
    >
      <Button
        onClick={() => {
          if (toggleSmallScreenMap) setToggleSmallScreenMap(false);
          else {
            setToggleSmallScreenMap(true);
          }
        }}
        sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
        size="xs"
        variant="outline"
        color="dark"
        styles={(theme) => ({
          label: { whiteSpace: "break-spaces", textAlign: "center" },
        })}
      >
        {toggleSmallScreenMap ? "List View" : "Map View"}
      </Button>
    </Box>
  );
};
