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
  header: {
    backgroundColor: theme.colors.orange[0],
    borderBottom: `0.5px solid ${
      theme.colorScheme === "dark" ? "transparent" : theme.colors.dark[1]
    }`,
  },
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
    backgroundColor: theme.colors.orange[0],
    border: `0.5px solid ${theme.colors.dark[1]}`,
  },

  item: {
    position: "fixed",
    top: HEADER_HEIGHT,

    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
    backgroundColor: theme.colors.orange[0],
    border: `0.5px solid ${theme.colors.dark[1]}`,
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
        : theme.colors.dark[5],
    fontSize: theme.fontSizes.sm,
    fontWeight: 600,

    "&:hover": {
      border: `1px solid`,
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
      <Menu.Item component={Link} to={item.link}>
        {item.label}
      </Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          trigger={"hover"}
          position="right-start"
          exitTransitionDuration={0}
        >
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
          <Menu.Dropdown className={classes.dropdown}>
            {menuItems}
          </Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <Link
        to={link.link}
        className={classes.link}
        //onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Link>
    );
  });

  return (
    <Header height={HEADER_HEIGHT} className={classes.header}>
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
              <Paper className={classes.item} withBorder style={styles}>
                {items}
              </Paper>
            )}
          </Transition>
        </Group>
        <Group>
          <div className={classes.link}>Contact us</div>
          <Button
            component={Link}
            to="/"
            variant="outline"
            color="dark"
            radius="sm"
            sx={{ height: HEADER_HEIGHT / 2 }}
          >
            Login
          </Button>
          <Button
            variant="filled"
            color="dark"
            component={Link}
            to="/"
            radius="sm"
            sx={{ height: HEADER_HEIGHT / 2 }}
          >
            Sign up
          </Button>
        </Group>
      </Container>
    </Header>
  );
};
