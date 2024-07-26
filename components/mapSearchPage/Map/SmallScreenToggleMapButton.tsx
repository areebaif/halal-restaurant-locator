import * as React from "react";
import { Button, Box } from "@mantine/core";

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
        position: "absolute",
        zIndex: 1,
        bottom: "0.5em",
        left: "50%",
        transform: "translate(-50%, 0)",
        [theme.fn.largerThan("md")]: {
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
