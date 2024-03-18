import * as React from "react";
import {
  Flex,
  TextInput,
  Button,
  Card,
  Title,
  Text,
  Grid,
  Center,
} from "@mantine/core";
import Link from "next/link";
import { ErrorCard } from "..";

export const RestaurantSuggestionForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [adress, setAdress] = React.useState("");
  const [isError, setIsError] = React.useState(false);
  const onSendEmail = (e: React.MouseEvent) => {
    setIsError(false);
    if (!name.length && !adress.length) {
      e.preventDefault();
      e.stopPropagation();
      setIsError(true);
    }
  };
  const RestaurantSuggestionFormProps = {
    name,
    setName,
    adress,
    setAdress,
    isError,
    onSendEmail,
  };

  return (
    <>
      <LargeSizeRestaurantSuggestionForm {...RestaurantSuggestionFormProps} />
      <SmallSizeRestaurantSuggestionForm {...RestaurantSuggestionFormProps} />
    </>
  );
};

type RestaurantSuggestionFormProps = {
  name: string;
  setName: (val: string) => void;
  adress: string;
  setAdress: (val: string) => void;
  isError: boolean;
  onSendEmail: (e: React.MouseEvent) => void;
};

const SmallSizeRestaurantSuggestionForm: React.FC<
  RestaurantSuggestionFormProps
> = ({ name, setName, adress, setAdress, isError, onSendEmail }) => {
  return (
    <Card
      sx={(theme) => ({
        [theme.fn.largerThan("md")]: {
          display: "none",
        },
      })}
      radius={"md"}
      style={{ backgroundColor: "inherit" }}
    >
      <Card.Section>
        {" "}
        <Title ta="center" order={1}>
          {" "}
          Help us grow our library
        </Title>
        <Text ta="center" size="xl" mt="md">
          Do you know a restaurant that is not on our website?
        </Text>
      </Card.Section>
      <TextInput
        mt="xs"
        placeholder="enter here"
        label="restaurant name"
        withAsterisk
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextInput
        mt="sm"
        placeholder="please include street, city, zipcode"
        label="adress"
        withAsterisk
        value={adress}
        onChange={(event) => setAdress(event.currentTarget.value)}
      />
      {isError && (
        <ErrorCard message="please enter name and adress to continue" />
      )}
      <Center>
        <Button
          mt="sm"
          component={Link}
          variant="outline"
          color="dark"
          // TODO: fix the mailTo
          onClick={(e) => onSendEmail(e)}
          href={`mailto:jamie@fakeemail.com?subject=Restaurant Suggestion&body=Hi,%0D%0DRestaurantName: ${name} %0D%0DAdress: ${adress}`}
          target="_blank"
        >
          Send restaurant suggestion as email
        </Button>
      </Center>
    </Card>
  );
};

const LargeSizeRestaurantSuggestionForm: React.FC<
  RestaurantSuggestionFormProps
> = ({ name, setName, adress, setAdress, isError, onSendEmail }) => {
  return (
    <Card
      sx={(theme) => ({
        [theme.fn.smallerThan("md")]: {
          display: "none",
        },
      })}
      style={{ backgroundColor: "inherit" }}
    >
      <Grid align={"center"}>
        <Grid.Col span={6}>
          <Center>
            <div>
              <Text
                fw={500}
                sx={(theme) => ({
                  fontSize: `calc(${theme.fontSizes.xs}*2.5)`,
                })}
              >
                Help us grow our library
              </Text>
              <Text size="xl" mt="md">
                Do you know a restaurant that is not on our website?
              </Text>
              <Text size="lg" mt="md">
                Tell us the name and adress of the restaurant.
              </Text>
            </div>
          </Center>
        </Grid.Col>
        <Grid.Col span={6}>
          <Card
            style={{ backgroundColor: "inherit" }}
            withBorder
            shadow="xs"
            radius={"md"}
          >
            <TextInput
              mt="xs"
              placeholder="enter here"
              label="restaurant name"
              withAsterisk
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
            <TextInput
              mt="sm"
              placeholder="please include street, city, zipcode"
              label="adress"
              withAsterisk
              value={adress}
              onChange={(event) => setAdress(event.currentTarget.value)}
            />
            {isError && (
              <ErrorCard message="please enter name and adress to continue" />
            )}
            <Center>
              <Button
                variant="outline"
                color="dark"
                mt="sm"
                component={Link}
                // TODO: fix the mailTo
                onClick={(e) => onSendEmail(e)}
                href={`mailto:jamie@fakeemail.com?subject=Restaurant Suggestion&body=Hi,%0D%0DRestaurantName: ${name} %0D%0DAdress: ${adress}`}
                target="_blank"
              >
                Send an email
              </Button>
            </Center>
          </Card>
        </Grid.Col>
      </Grid>
    </Card>
  );
};
