import { Image, Box } from "@mantine/core";

import { SearchWithText } from "./SearchWithText";
import { SimpleGrid } from "@mantine/core";

export const AboveTheFold: React.FC = () => {
  return (
    <SimpleGrid
      breakpoints={[
        { maxWidth: "md", cols: 1 },
        { minWidth: "md", cols: 2, spacing: "xl" },
      ]}
      style={{ alignItems: "center" }}
    >
      <SearchWithText />
      <Box
        // This centers the image in its parent container with overflow hidden
        style={{
          maxHeight: 400,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          alt="google map with multiple restaurant location shown as marker on map."
          src={"./map-locations.png"}
          sx={(theme) => ({
            width: "100%",
            height: "auto",
            [theme.fn.smallerThan("md")]: {
              display: "none",
            },
          })}
        />
      </Box>
    </SimpleGrid>
  );
};
