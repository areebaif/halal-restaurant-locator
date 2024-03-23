import { HeroHeader } from "./HeroHeader";
import { HeroText } from "./HeroText";
import { SearchInput } from "..";
import { Box, Flex, BackgroundImage } from "@mantine/core";

export const HeroComponent: React.FC = () => {
  return (
    <Box>
      <BackgroundImage
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            backgroundImage: "none",
          },
        })}
        src={"./hero-image.png"}
      >
        <Flex
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              width: "100%",
            },
            width: "50%",
          })}
          direction="column"
        >
          <Flex
            sx={(theme) => ({
              [theme.fn.smallerThan("sm")]: {
                width: "100%",
              },
              width: "80%",
            })}
          >
            <HeroHeader />
          </Flex>
          <Box
            mb="xl"
            pb="xl"
            pt="md"
            pl="xl"
            ml="md"
            sx={(theme) => ({
              [theme.fn.smallerThan("sm")]: {
                paddingLeft: 0,
                marginLeft: 0,
                paddingBottom: 0,
              },
            })}
          >
            <SearchInput />
          </Box>
        </Flex>
      </BackgroundImage>
    </Box>
  );
};
