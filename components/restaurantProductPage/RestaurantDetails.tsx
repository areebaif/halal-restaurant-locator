import * as React from "react";
import { GetRestaurant } from "@/utils/types";
import {
  Box,
  MediaQuery,
  Title,
  Text,
  Badge,
  Group,
  Flex,
  Divider,
  NavLink,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandGoogleFit,
  IconBrandGoogleMaps,
  IconBrandUber,
  IconCircleLetterD,
  IconPhone,
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
      <Text size="xs">
        {`${restaurantData.street}, ${restaurantData.city}, ${restaurantData.state}, ${restaurantData.zipcode}, ${restaurantData.country}`}
      </Text>
      <Group spacing={"0"}>
        {" "}
        <IconPhone color="gray" size="0.8rem" stroke={1.5} />
        <Text pl="0.4rem" color="gray" size="xs">
          (123) 456-7890
        </Text>
      </Group>
      <Divider my="xs" />
      <Title size={"h3"} order={1}>
        {" "}
        Food type
      </Title>
      <Text size="md">{restaurantData.description}</Text>
      <Flex wrap="wrap" gap="xs" pt="xs" direction={"row"}>
        {restaurantData.FoodTag.map((tag: any) => (
          <Badge color="red" size="md">
            {tag}
          </Badge>
        ))}
      </Flex>
      <Divider my="xs" />
      <Title size={"h3"} order={1}>
        {" "}
        External links
      </Title>
      <ContactInfo />
      <Divider my="xs" />
      <Title size={"h3"} order={1}>
        {" "}
        Delivery
      </Title>
      <Delivery />
    </Box>
  );
};

const ContactInfo: React.FC = () => {
  return (
    <SimpleGrid
      breakpoints={[
        { maxWidth: "sm", cols: 1 },
        { minWidth: "sm", cols: 2 },
        { minWidth: "md", cols: 3 },
      ]}
    >
      <NavLink
        label="Facebook"
        icon={
          <ThemeIcon variant={"light"} color="blue">
            <IconBrandFacebook size="1rem" stroke={1.5} />
          </ThemeIcon>
        }
      />
      <NavLink
        label=" website"
        icon={
          <ThemeIcon variant={"light"} color="green">
            <IconWorld size="1rem" stroke={1.5} />
          </ThemeIcon>
        }
      />
      <NavLink
        label="Google search"
        icon={
          <ThemeIcon variant={"light"} color="blue">
            {" "}
            <IconBrandGoogle size="1rem" stroke={1.5} />
          </ThemeIcon>
        }
      />
    </SimpleGrid>
  );
};

const Delivery: React.FC = () => {
  return (
    <SimpleGrid
      breakpoints={[
        { maxWidth: "sm", cols: 1 },
        { minWidth: "sm", cols: 2 },
        { minWidth: "md", cols: 3 },
      ]}
    >
      <NavLink
        label="Uber Eats"
        icon={
          <ThemeIcon variant={"light"} color="teal">
            <IconBrandUber size="1rem" stroke={1.5} />
          </ThemeIcon>
        }
      />
      <NavLink
        label="DoorDash"
        icon={
          <ThemeIcon variant={"light"} color="red">
            <IconCircleLetterD size="1rem" stroke={1.5} />
          </ThemeIcon>
        }
      />
    </SimpleGrid>
  );
};
