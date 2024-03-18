import { Box, Title, Text, Image, Card, Grid, ThemeIcon } from "@mantine/core";
import { IconCircleDotted } from "@tabler/icons-react";

export const MapWithText: React.FC = () => {
  return (
    <>
      <LargeSizeMapWithText />
      <SmallSizeMapWithText />
    </>
  );
};

const LargeSizeMapWithText: React.FC = () => {
  return (
    <Card
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          display: "none",
        },
      })}
      style={{ backgroundColor: "inherit" }}
    >
      <Card.Section>
        {" "}
        <Title ta="center" order={1}>
          {" "}
          Use our search functionality to browse halal restaurant on a map
        </Title>
      </Card.Section>
      <Grid gutter={"xl"} align="center" mt="md">
        <Grid.Col span={6}>
          <Box
            sx={(theme) => ({
              [theme.fn.largerThan("lg")]: {
                //marginTop: `calc(${theme.spacing.xl} * -1)`,
                //marginBottom: `calc(${theme.spacing.xl} * -1)`,
                //marginRight: `calc(${theme.spacing.xl} * -1)`,
              },
              overflow: "hidden",
            })}
          >
            <Image src={"/map-locations.png"} />
          </Box>
        </Grid.Col>
        <Grid.Col span={6}>
          <Box
            sx={(theme) => ({
              [theme.fn.largerThan("md")]: {
                marginLeft: `calc(${theme.spacing.xl}*2)`,
              },
              [theme.fn.smallerThan("md")]: {
                marginLeft: `calc(${theme.spacing.xl}*2)`,
                marginRight: `calc(${theme.spacing.xl}*2)`,
              },
            })}
          >
            <Text
              mb="md"
              fw={500}
              sx={(theme) => ({
                fontSize: `calc(${theme.fontSizes.xs}*2.5)`,
              })}
            >
              Don't know where halal restaurants are?
            </Text>

            <Text size="xl">
              <span>
                <ThemeIcon
                  variant="outline"
                  color="gray"
                  size={13}
                  radius="xl"
                  mr="xs"
                >
                  <IconCircleDotted size={10} stroke={1.5} />
                </ThemeIcon>
              </span>
              Are you travelling to a new city?
            </Text>

            <Text size="xl">
              <span>
                <ThemeIcon
                  variant="outline"
                  color="gray"
                  size={13}
                  radius="xl"
                  mr="xs"
                >
                  <IconCircleDotted size={10} stroke={1.5} />
                </ThemeIcon>
              </span>
              Do you want to try something new in your area?
            </Text>

            <Text size="xl">
              <span>
                <ThemeIcon
                  variant="outline"
                  color="gray"
                  size={13}
                  radius="xl"
                  mr="xs"
                >
                  <IconCircleDotted size={10} stroke={1.5} />
                </ThemeIcon>
              </span>
              Don't worry, we have you covered!
            </Text>
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

const SmallSizeMapWithText: React.FC = () => {
  return (
    <Card
      sx={(theme) => ({
        [theme.fn.largerThan("md")]: {
          display: "none",
        },
      })}
      style={{ backgroundColor: "inherit" }}
    >
      <Card.Section>
        {" "}
        <Title ta="center" order={1}>
          {" "}
          Use our search functionality to browse halal restaurant on a map
        </Title>
      </Card.Section>
      <Box
        sx={(theme) => ({
          overflow: "hidden",
          marginTop: theme.spacing.md,
        })}
      >
        <Image src={"/map-locations.png"} />
      </Box>
    </Card>
  );
};
