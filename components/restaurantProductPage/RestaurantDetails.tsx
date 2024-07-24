import * as React from "react";
import { GetRestaurant } from "@/utils/types";
import {
  Box,
  MediaQuery,
  Title,
  Text,
  Badge,
  UnstyledButton,
  Flex,
  Divider,
  Button,
  Grid,
  Group,
  SimpleGrid,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandUber,
  IconCircleLetterD,
  IconLetterD,
  IconPhone,
  IconSquareLetterD,
  IconWorld,
} from "@tabler/icons-react";

export type RestauratnDetailProps = {
  restaurantData: GetRestaurant;
};

// TODO: add links to button and make them disabled if they dont exist for contact delivery

export const RestaurantDetails: React.FC<RestauratnDetailProps> = ({
  restaurantData,
}) => {
  return (
    <Box>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Title size={"h2"} order={1}>
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Title pt="sm" size={"h3"} order={1}>
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <Text size="xs" color="dimmed">
        {`${restaurantData.street}, ${restaurantData.city}, ${restaurantData.state}, ${restaurantData.zipcode}, ${restaurantData.country}`}
      </Text>
      <UnstyledButton>
        <Text color="blue" size="xs">
          Google search link
        </Text>
        <Flex wrap="wrap" gap="xs" pt="xs" direction={"row"}>
          {restaurantData.FoodTag.map((tag: any) => (
            <Badge color="red" size="md">
              {tag}
            </Badge>
          ))}
        </Flex>
      </UnstyledButton>
      <Text size="md" pt="xs">
        {restaurantData.description}
      </Text>
      <Divider my="xs" />
      <Title pb="xs" size={"h3"} order={1}>
        {" "}
        Contact
      </Title>

      <ContactSmallScreen />
      <ContactLargeScreen />
      <Divider my="xs" />
      <Title size={"h3"} pb="xs" order={1}>
        {" "}
        Delivery
      </Title>
      <Delivery />
    </Box>
  );
};

const ContactSmallScreen: React.FC = () => {
  return (
    <Flex
      sx={(theme) => ({ [theme.fn.largerThan("sm")]: { display: "none" } })}
      direction={"column"}
      gap={"sm"}
      justify={"center"}
      pb="xs"
    >
      <Button variant={"outline"} color={"dark"} leftIcon={<IconPhone />}>
        (123) 456-7890
      </Button>
      <Button variant={"outline"} color="blue" leftIcon={<IconBrandFacebook />}>
        link
      </Button>{" "}
      <Button variant={"outline"} color={"lime"} leftIcon={<IconWorld />}>
        website
      </Button>
    </Flex>
  );
};

const ContactLargeScreen: React.FC = () => {
  return (
    <>
      <Grid
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: { display: "none" },
          [theme.fn.largerThan("md")]: { display: "none" },
        })}
        pb="xs"
        gutter={"xs"}
      >
        <Grid.Col sm={6}>
          <Button color={"dark"} variant={"outline"} leftIcon={<IconPhone />}>
            (123) 456-7890
          </Button>
        </Grid.Col>
        <Grid.Col sm={1}>
          <Button
            variant={"outline"}
            color="blue"
            leftIcon={<IconBrandFacebook />}
          >
            link
          </Button>
        </Grid.Col>
        <Grid.Col sm={6}>
          <Button color={"lime"} variant={"outline"} leftIcon={<IconWorld />}>
            website
          </Button>
        </Grid.Col>
      </Grid>
      <Group
        sx={(theme) => ({ [theme.fn.smallerThan("md")]: { display: "none" } })}
        position="apart"
        pb="xs"
      >
        <Button color={"dark"} variant={"outline"} leftIcon={<IconPhone />}>
          (123) 456-7890
        </Button>
        <Button
          variant={"outline"}
          color="blue"
          leftIcon={<IconBrandFacebook />}
        >
          link
        </Button>
        <Button color={"lime"} variant={"outline"} leftIcon={<IconWorld />}>
          website
        </Button>
      </Group>
    </>
  );
};

const Delivery: React.FC = () => {
  return (
    <SimpleGrid
      breakpoints={[
        { maxWidth: "md", cols: 1, spacing: "sm" },
        { minWidth: "48rem", cols: 2, spacing: "xl" },
      ]}
    >
      <Button variant={"outline"} color="teal" leftIcon={<IconBrandUber />}>
        Uber Eats
      </Button>

      <Button variant={"outline"} color="red" leftIcon={<IconCircleLetterD />}>
        DoorDash
      </Button>
    </SimpleGrid>
  );
};
