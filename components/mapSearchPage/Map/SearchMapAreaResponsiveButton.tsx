import * as React from "react";
import { Button, MediaQuery, Box } from "@mantine/core";

type ResponsiveSearchAreaButtonProps = {
  onExpandSearchRadius: () => void;
};

export const ResponsiveSearchAreaButton: React.FC<
  ResponsiveSearchAreaButtonProps
> = ({ onExpandSearchRadius }) => {
  return (
    <>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Button
          // on xs small devices centre the button
          onClick={onExpandSearchRadius}
          size="xs"
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

            [theme.fn.smallerThan("md")]: {
              width: "30%",
              position: "absolute",
              top: "1em",
              left: 0,
              right: 0,
              bottom: 0,
              margin: "0 auto",
            },
            [theme.fn.smallerThan("xs")]: { width: "40%" },
          })}
        >
          Search this area
        </Button>
      </MediaQuery>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Button
          // on xs small devices centre the button
          onClick={onExpandSearchRadius}
          size="xs"
          variant="outline"
          color="dark"
          styles={(theme) => ({
            label: { whiteSpace: "break-spaces", textAlign: "center" },
          })}
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
            position: "absolute",
            zIndex: 1,
            top: "1em",
            right: "1em",
          })}
        >
          Search this area
        </Button>
      </MediaQuery>
    </>
  );
};
