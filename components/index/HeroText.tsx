import {
  Text,
  Center,
  Title,
  List,
  ThemeIcon,
  Autocomplete,
  Flex,
  Button,
  Group,
  Grid,
  Box,
} from "@mantine/core";

import { IconCheck, IconSearch } from "@tabler/icons-react";
export const HeroText: React.FC = () => {
  return (
    <>
      <Title py="xl" mt="xl">
        Explore halal food options near you
      </Title>
      <Text py="xl" size="xl">
        Find halal options near you with ease – We update our library every day
        to include new places near you!
      </Text>
      <List
        sx={(theme) => ({
          color: theme.white,
          [theme.fn.smallerThan("sm")]: {
            color: theme.colors.dark[5],
          },
        })}
        my="xl"
        mb="xl"
        spacing="sm"
        size="sm"
        icon={
          <ThemeIcon ml="xs" color="grey" size={13} radius="xl">
            <IconCheck size={10} stroke={1.5} />
          </ThemeIcon>
        }
      >
        <List.Item>
          <b>Save time</b> – Your one stop solution to finding halal food
        </List.Item>
        <List.Item>
          <b>Have guests over?</b> – Find catering options near you
        </List.Item>
        <List.Item>
          <b>Halal raw meat</b> – find supermarkets that sell halal meat near
          you
        </List.Item>
      </List>
    </>
  );
};
