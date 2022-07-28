import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  root: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundImage: "url(/hero.jpg)",
    paddingTop: theme.spacing.xl * 1,
    paddingBottom: theme.spacing.xl * 3,
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 1,
    paddingBottom: theme.spacing.xl * 2,
    marginRight: theme.spacing.xl * 3,
    maxWidth: 600,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    //fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 50,
    lineHeight: 1.5,
    fontWeight: 700,

    [theme.fn.smallerThan("xs")]: {
      fontSize: 28,
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },
}));

export function HeroBullets() {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Explore halal food options near you
            </Title>

            <Text size="xl" mt={30}>
              Find halal options near you with ease – We update our library
              every day to include new places near you!
            </Text>
            <List
              mt={30}
              mb={40}
              spacing="sm"
              size="md"
              icon={
                <ThemeIcon color="grey" size={15} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>Save Time</b> – Ypur one stop solution to finding halal food
              </List.Item>
              <List.Item>
                <b>Have guests over?</b> – Find catering options near you
              </List.Item>
              <List.Item>
                <b>Halal raw meat</b> – find supermarkets that sell halal meat
                near you
              </List.Item>
            </List>

            <Button size="md" color="dark" variant="outline">
              <Text color="dark">Get started</Text>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
