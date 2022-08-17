import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Text,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";

const useStyles = createStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
    backgroundSize: "cover",
    backgroundPosition: "right",
    backgroundImage: "url(/food-3.png)",
    paddingTop: theme.spacing.xl * 1,
    paddingBottom: theme.spacing.xl * 3,

    [theme.fn.smallerThan("md")]: {
      backgroundImage: "none",
    },
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",

    [theme.fn.smallerThan("md")]: {
      flexDirection: "column",
    },
  },

  image: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  content: {
    paddingTop: theme.spacing.xl * 2,
    paddingBottom: theme.spacing.xl * 2,
    paddingLeft: theme.spacing.xl * 4,
    marginRight: theme.spacing.xl * 3,
    maxWidth: "40%",
    color: theme.white,

    [theme.fn.smallerThan("md")]: {
      marginRight: 0,
    },
  },

  title: {
    color: theme.white,

    fontSize: theme.fontSizes.xl * 2,
    lineHeight: 1.5,
    fontWeight: 600,
  },

  item: {
    color: "white",
  },
  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },
}));

export const HeroBullets: React.FC = () => {
  const { classes } = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Explore halal food options near you
          </Title>

          <Text size="xl" mt={30}>
            Find halal options near you with ease – We update our library every
            day to include new places near you!
          </Text>
          <List
            className={classes.item}
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
          <Button
            size="md"
            variant="outline"
            color="dark"
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.gray[0],
                border: `1px solid`,
                "&:hover": {
                  backgroundColor: theme.colors.gray[1],
                },
              },
            })}
          >
            <Text>Get started</Text>
          </Button>
        </div>
      </div>
    </div>
  );
};
