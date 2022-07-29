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
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    paddingLeft: theme.spacing.xl * 1.5,
    marginRight: theme.spacing.xl * 3,
    maxWidth: 550,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    //fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: theme.fontSizes.xl * 2,
    lineHeight: 1.5,
    fontWeight: 600,
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
      <Container size="xl">
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              Explore halal food options near you
            </Title>

            <Text size="lg" mt={30}>
              Find halal options near you with ease – We update our library
              every day to include new places near you!
            </Text>
            <List
              mt={30}
              mb={40}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon color="grey" size={13} radius="xl">
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
                <b>Halal raw meat</b> – find supermarkets that sell halal meat
                near you
              </List.Item>
            </List>
            {/* TODO: Link React router here to the button*/}
            <Button size="md" color="dark" variant="outline">
              <Text color="dark">Get started</Text>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
