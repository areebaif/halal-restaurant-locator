import * as React from "react";
import { useRouter } from "next/router";
import {
  Button,
  createStyles,
  AppShell,
  Header,
  Container,
  Title,
  Flex,
  Footer,
  Burger,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import {
  IconFileDatabase,
  IconMap,
  IconMapPin,
  IconToolsKitchen2,
  IconUser,
} from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
  },

  burger: {
    [theme.fn.largerThan("xs")]: { display: "none" },
  },
  rightNavigation: {
    [theme.fn.smallerThan("xs")]: { display: "none" },
  },
  root: {
    "&:hover": { backgroundColor: theme.colors.gray[1] },
  },
  container: {
    [theme.fn.smallerThan(550)]: {
      padding: 0,
      margin: "auto",
      maxWidth: `calc(100% - 5px)`,
    },
    [theme.fn.largerThan(550)]: {
      maxWidth: "100%",
    },
    [theme.fn.largerThan("lg")]: {
      maxWidth: "90%",
    },
    [theme.fn.largerThan("xl")]: { maxWidth: "80%" },
  },
}));

export const AppChrome: React.FC<React.PropsWithChildren> = (props) => {
  const router = useRouter();
  const { classes } = useStyles();
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      //padding={"xs"}
      // footer={
      //   <Footer
      //     height={300}
      //     //p="xs"
      //     sx={(theme) => ({
      //       [theme.fn.smallerThan("sm")]: {
      //         // height: 40,
      //         // padding: 0,
      //         display: "none",
      //       },
      //     })}
      //   >
      //     <Group mt={0} spacing="xs" position="center">
      //       <Title order={6}>Location Icon Credits:</Title>
      //       <Link href={"https://www.flaticon.com/free-icons/location"}>
      //         <Button variant="unstyled">Flaticon</Button>
      //       </Link>
      //     </Group>
      //   </Footer>
      // }
      header={
        <Header height={60} className={classes.header}>
          <Flex
            direction={"row"}
            gap={{ base: "xs" }}
            justify={"flex-start"}
            align={"center"}
          >
            <IconToolsKitchen2 size={"2em"} color={"#74C0FC"} />
            <Title onClick={() => router.push("/")} order={3}>
              Halal Food Finder
            </Title>
          </Flex>
          <Flex
            direction={"row"}
            justify={"flex-start"}
            align={"center"}
            style={{ marginLeft: "auto" }}
          >
            <HamburgerMenu opened={opened} toggle={toggle} />
            <NavigationItems />
          </Flex>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[8] : "white",
        },
      })}
    >
      <Container className={classes.container}>{props.children}</Container>
    </AppShell>
  );
};

type HamburgerMenuProps = {
  opened: boolean;
  toggle: () => void;
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ opened, toggle }) => {
  const router = useRouter();
  const { classes } = useStyles();
  return (
    <Menu shadow="md">
      <Menu.Target>
        <Burger
          className={classes.burger}
          opened={opened}
          onClick={toggle}
          size="sm"
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Restaurants</Menu.Label>
        <Menu.Item icon={<IconMapPin size={14} />}>Near Me</Menu.Item>
        <Menu.Item
          onClick={() => {
            router.push("/country/U.S.A");
          }}
          icon={<IconMap size={14} />}
        >
          By States in U.S.A
        </Menu.Item>
        <Menu.Item icon={<IconFileDatabase size={14} />}>
          Suggest Restaurant
        </Menu.Item>
        <Menu.Label>About</Menu.Label>
        <Menu.Item icon={<IconFileDatabase size={14} />}>
          Halal Disclaimer
        </Menu.Item>
        <Menu.Item icon={<IconUser size={14} />}>About Us</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const NavigationItems: React.FC = () => {
  const router = useRouter();
  const { classes } = useStyles();
  return (
    <Flex direction={"row"} className={classes.rightNavigation}>
      <Menu shadow="md">
        <Menu.Target>
          <Button
            size="md"
            className={classes.root}
            variant="subtle"
            color="dark"
          >
            Restaurant
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconMapPin size={14} />}>Near Me</Menu.Item>
          <Menu.Item
            onClick={() => {
              router.push("/country/U.S.A");
            }}
            icon={<IconMap size={14} />}
          >
            By States in U.S.A
          </Menu.Item>
          <Menu.Item icon={<IconFileDatabase size={14} />}>
            Suggest Restaurant
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu shadow="md">
        <Menu.Target>
          <Button
            size="md"
            className={classes.root}
            variant="subtle"
            color="dark"
          >
            About
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item icon={<IconFileDatabase size={14} />}>
            Halal Disclaimer
          </Menu.Item>
          <Menu.Item icon={<IconUser size={14} />}>About Us</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
