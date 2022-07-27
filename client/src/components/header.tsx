import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger,
  Paper,
  Transition,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { IconChevronDown } from "@tabler/icons";

const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "left",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  dropdown: {
    position: "fixed",
    top: HEADER_HEIGHT,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 550,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

export interface HeaderActionProps {
  links: {
    link: string;
    label: string;
    dropDownLinks?: { link: string; label: string }[];
  }[];
}

export const HeaderAction = ({ links }: HeaderActionProps) => {
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure(false);

  // drop down menu items
  const items = links.map((link) => {
    const menuItems = link.dropDownLinks?.map((item) => (
      <Menu.Item component={Link} to={item.link} key={item.link}>
        {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu key={link.label} trigger={"hover"} exitTransitionDuration={0}>
          <Menu.Target>
            <Link
              to={link.link}
              className={classes.link}
              //onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <IconChevronDown size={12} stroke={1.5} />
              </Center>
            </Link>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.link}
        className={classes.link}
        //onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <Header height={HEADER_HEIGHT} mb={10}>
      <Container className={classes.inner} fluid>
        <Group spacing={100}>
          <div>Logo</div>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>
        </Group>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            className={classes.burger}
            size="sm"
          />
          <Transition transition="pop-top-left" duration={50} mounted={opened}>
            {(styles) => (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Group>
        <Group>
          <Button variant="outline" radius="sm" sx={{ height: 35 }}>
            Login
          </Button>
          <Button radius="sm" sx={{ height: 35 }}>
            Sign up
          </Button>
        </Group>
      </Container>
    </Header>
  );
};
