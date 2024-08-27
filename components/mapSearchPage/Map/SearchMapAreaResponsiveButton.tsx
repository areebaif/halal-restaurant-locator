import * as React from "react";
import { Button, MediaQuery, Box } from "@mantine/core";

type ResponsiveSearchAreaButtonProps = {
  onExpandSearchRadius: () => void;
};

export const ResponsiveSearchAreaButton: React.FC<
  ResponsiveSearchAreaButtonProps
> = ({ onExpandSearchRadius }) => {
  return (
    <Button
      onClick={onExpandSearchRadius}
      size="xs"
      radius={"xs"}
      variant="outline"
      color="dark"
      styles={(theme) => ({
        label: {
          whiteSpace: "break-spaces",
          textAlign: "center",
        },
      })}
      sx={(theme) => ({
        backgroundColor: theme.colors.gray[0],
        zIndex: 1,
        position: "absolute",
        [theme.fn.smallerThan("md")]: {
          width: "25%",
          top: "1em",
          left: 0,
          right: 0,
          // bottom: 0,
          margin: "0 auto",
          fontWeight: 500,
        },
        [theme.fn.smallerThan("xs")]: { width: "40%" },
        [theme.fn.largerThan("md")]: {
          top: "1em",
          right: "1em",
          fontWeight: 500,
        },
      })}
    >
      Search this area
    </Button>
  );
};
