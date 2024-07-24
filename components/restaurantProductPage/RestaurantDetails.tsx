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
} from "@mantine/core";
import { IconBrandFacebook, IconPhone, IconWorld } from "@tabler/icons-react";

export type RestauratnDetailProps = {
  restaurantData: GetRestaurant;
};

export const RestaurantDetails: React.FC<RestauratnDetailProps> = ({
  restaurantData,
}) => {
  return (
    <Box>
      <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
        <Title size={"h2"} order={1}>
          {" "}
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
        <Title pt="sm" size={"h3"} order={1}>
          {" "}
          {restaurantData.restaurantName}
        </Title>
      </MediaQuery>
      <Text size="xs" color="dimmed">
        {`${restaurantData.street}, ${restaurantData.city}, ${restaurantData.state}, ${restaurantData.zipcode}, ${restaurantData.country}`}
      </Text>
      <UnstyledButton>
        <Text color="blue" size="xs">
          {"  "}
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
      <Title size={"h3"} order={1}>
        {" "}
        Contact
      </Title>
      <ContactSmallScreen />
      <ContactLargeScreen />
      <Divider my="xs" />

      <Title size={"h3"} order={1}>
        {" "}
        Delivery
      </Title>
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
    >
      <Button variant={"outline"} leftIcon={<IconPhone />}>
        (123) 456-7890
      </Button>
      <Button variant={"outline"} color="blue" leftIcon={<IconBrandFacebook />}>
        link
      </Button>{" "}
      <Button variant={"outline"} color="blue" leftIcon={<IconWorld />}>
        website
      </Button>
    </Flex>
  );
};

const ContactLargeScreen: React.FC = () => {
  return (
    <Grid
      sx={(theme) => ({ [theme.fn.smallerThan("sm")]: { display: "none" } })}
      gutter={"xs"}
    >
      <Grid.Col sm={6}>
        <Button variant={"outline"} leftIcon={<IconPhone />}>
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
        {" "}
        <Button variant={"outline"} color="blue" leftIcon={<IconWorld />}>
          website
        </Button>
      </Grid.Col>
    </Grid>
  );
};
