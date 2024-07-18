import * as React from "react";
import {
  TextInput,
  Button,
  Card,
  Title,
  Text,
  Center,
  createStyles,
  SimpleGrid,
  MediaQuery,
  Box,
} from "@mantine/core";
import Link from "next/link";
import { ErrorCard } from "..";

const useStyles = createStyles((theme) => ({
  textInput: {
    input: {
      "&:focus": { border: "1px solid black" },
    },
  },
  smallScreen: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
    backgroundColor: "inherit",
  },
  largeScreen: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
    backgroundColor: "inherit",
  },
}));

export const RestaurantSuggestion: React.FC = () => {
  const { classes } = useStyles();
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
    <SimpleGrid
      breakpoints={[
        { maxWidth: "md", cols: 1 },
        { minWidth: "md", cols: 2 },
      ]}
    >
      <FormWithText {...RestaurantSuggestionFormProps} />
      <Card className={classes.largeScreen}>
        <Card.Section>
          <SuggestionForm {...RestaurantSuggestionFormProps} />
        </Card.Section>
      </Card>
    </SimpleGrid>
  );
};

type RestaurantSuggestionProps = {
  name: string;
  setName: (val: string) => void;
  adress: string;
  setAdress: (val: string) => void;
  isError: boolean;
  onSendEmail: (e: React.MouseEvent) => void;
};

const FormWithText: React.FC<RestaurantSuggestionProps> = ({
  name,
  setName,
  adress,
  setAdress,
  isError,
  onSendEmail,
}) => {
  const { classes } = useStyles();
  const RestaurantSuggestionFormProps = {
    name,
    setName,
    adress,
    setAdress,
    isError,
    onSendEmail,
  };
  return (
    <Card pt="lg" mt="lg" style={{ backgroundColor: "inherit" }}>
      <Card.Section>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h2"} order={1}>
            {" "}
            Help us grow our library
          </Title>
        </MediaQuery>
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h3"} order={1}>
            {" "}
            Help us grow our library
          </Title>
        </MediaQuery>
        <Text size="md" mt="sm" color="dimmed">
          Do you know a restaurant that is not on our website?
        </Text>
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Text size="md" mt="sm" color="dimmed">
            Use the form on the right to tell us the name and adress of the
            place.
          </Text>
        </MediaQuery>
      </Card.Section>
      <Card.Section className={classes.smallScreen}>
        <SuggestionForm {...RestaurantSuggestionFormProps} />
      </Card.Section>
    </Card>
  );
};

const SuggestionForm: React.FC<RestaurantSuggestionProps> = ({
  name,
  setName,
  adress,
  setAdress,
  isError,
  onSendEmail,
}) => {
  const { classes } = useStyles();
  return (
    <Box
      sx={(theme) => ({
        [theme.fn.largerThan("md")]: { paddingTop: theme.spacing.xl },
      })}
    >
      <TextInput
        className={classes.textInput}
        mt="xs"
        placeholder="name"
        withAsterisk
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <TextInput
        mt="sm"
        className={classes.textInput}
        placeholder="adress"
        withAsterisk
        value={adress}
        onChange={(event) => setAdress(event.currentTarget.value)}
      />
      {isError && (
        <ErrorCard message="please enter name and adress to continue" />
      )}
      <Center>
        <Button
          mt="md"
          component={Link}
          variant="outline"
          color="dark"
          // TODO: fix the mailTo
          onClick={(e) => onSendEmail(e)}
          href={`mailto:jamie@fakeemail.com?subject=Restaurant Suggestion&body=Hi,%0D%0DRestaurantName: ${name} %0D%0DAdress: ${adress}`}
          target="_blank"
        >
          Send suggestion as email
        </Button>
      </Center>
    </Box>
  );
};
