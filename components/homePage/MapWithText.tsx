import { Flex, Center, Box, Title, Text, Image, Card } from "@mantine/core";

export const MapWithText: React.FC = () => {
  return (
    <Card shadow="xs" radius="md" withBorder>
      <Flex gap="xl">
        <Flex
          sx={(theme) => ({
            [theme.fn.smallerThan("lg")]: {
              width: "100%",
            },
            width: "50%",
          })}
        >
          <Box>
            <Title order={2}>Don't know where halal restaurants are?</Title>
            <Text py="xl" size="lmd">
              Our search functonality along with displaying halal restaurant
              locations on a map quickly allow you to browse restaurants in
              U.S.A with ease.
            </Text>

            <Text py="xl" size="lmd">
              Are you travelling to a new city and don't know where halal
              restaurants are?
            </Text>
            <Text py="xl" size="lmd">
              Do you want to try something new in your area?
            </Text>
            <Text py="xl" size="lmd">
              Don't worry we have you covered
            </Text>
          </Box>
        </Flex>
        <Box
          sx={(theme) => ({
            [theme.fn.smallerThan("lg")]: {
              display: "none",
            },
            [theme.fn.largerThan("lg")]: {
              marginTop: `calc(${theme.spacing.xl} * -1)`,
              marginBottom: `calc(${theme.spacing.xl} * -1)`,
              marginRight: `calc(${theme.spacing.xl} * -1)`,
            },
            width: "55%",
            overflow: "hidden",
          })}
        >
          <Image src={"/map-locations.png"} />
        </Box>
      </Flex>
    </Card>
  );
};
