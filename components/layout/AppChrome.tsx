import * as React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Button,
  createStyles,
  AppShell,
  Header,
  Container,
  Title,
  Flex,
  Burger,
  Menu,
  Loader,
} from "@mantine/core";

import {
  IconFileDatabase,
  IconMap,
  IconMapPin,
  IconToolsKitchen2,
  IconUser,
} from "@tabler/icons-react";

export type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

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
  const [openBurgerIcon, setOpenBurgerIcon] = React.useState(false);
  const [openSmallScreenMenu, setOpenSmallScreenMenu] = React.useState(false);
  const [openlargeScreenMenu, setOpenLargeScreenMenu] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setOpenSmallScreenMenu(false);
        setOpenLargeScreenMenu(false);
        setOpenBurgerIcon(false);
        setIsLoading(false);
        router.push(`/restaurants?latitude=${latitude}&longitude=${longitude}`);
      },
      (error) => {
        //TODO: do error handling
        console.log("Error get user location: ", error);
      }
    );
  };

  const hamburgerMenu = {
    openBurgerIcon,
    setOpenBurgerIcon,
    openSmallScreenMenu,
    setOpenSmallScreenMenu,
    setIsLoading,
    isLoading,
    getUserLocation,
  };
  const navigationLargeScreenProps = {
    openlargeScreenMenu,
    setOpenLargeScreenMenu,
    setIsLoading,
    isLoading,
    getUserLocation,
  };
  return (
    <AppShell
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
            <HamburgerMenu {...hamburgerMenu} />
            <NavigationLargeScreen {...navigationLargeScreenProps} />
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
  openBurgerIcon: boolean;
  setOpenBurgerIcon: (val: boolean) => void;
  openSmallScreenMenu: boolean;
  setOpenSmallScreenMenu: (val: boolean) => void;
  //setUserLocation: (val: UserLocation) => void;
  setIsLoading: (val: boolean) => void;
  isLoading: boolean;
  getUserLocation: () => void;
};

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  openBurgerIcon,
  setOpenBurgerIcon,
  openSmallScreenMenu,
  setOpenSmallScreenMenu,
  getUserLocation,
  setIsLoading,
  isLoading,
}) => {
  const router = useRouter();
  const { classes } = useStyles();
  return (
    <Menu
      opened={openSmallScreenMenu}
      shadow="md"
      onChange={() => {
        if (openSmallScreenMenu) setOpenSmallScreenMenu(false);
        else {
          setOpenSmallScreenMenu(true);
        }
      }}
    >
      <Menu.Target>
        <Burger
          className={classes.burger}
          opened={openBurgerIcon}
          onClick={() => {
            if (openBurgerIcon) setOpenBurgerIcon(false);
            else {
              setOpenBurgerIcon(true);
            }
          }}
          size="sm"
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Restaurants</Menu.Label>
        <Menu.Item
          onClick={() => {
            setIsLoading(true);
            getUserLocation();
          }}
          closeMenuOnClick={false}
          icon={isLoading ? <Loader size="xs" /> : <IconMapPin size={14} />}
        >
          Near Me
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            router.push("/country/U.S.A");
            if (openBurgerIcon) setOpenBurgerIcon(false);
            else {
              setOpenBurgerIcon(true);
            }
          }}
          icon={<IconMap size={14} />}
        >
          By States in U.S.A
        </Menu.Item>
        <Menu.Item
          component={Link}
          href={"/#suggestionBox"}
          onClick={() => {
            if (openBurgerIcon) setOpenBurgerIcon(false);
            else {
              setOpenBurgerIcon(true);
            }
          }}
          icon={<IconFileDatabase size={14} />}
        >
          Submit restaurant suggestion
        </Menu.Item>
        <Menu.Label>About</Menu.Label>
        <Menu.Item
          component={Link}
          onClick={() => {
            if (openBurgerIcon) setOpenBurgerIcon(false);
            else {
              setOpenBurgerIcon(true);
            }
          }}
          href={"/about#halal-disclaimer"}
          icon={<IconFileDatabase size={14} />}
        >
          Halal Disclaimer
        </Menu.Item>
        <Menu.Item
          onClick={() => {
            if (openBurgerIcon) setOpenBurgerIcon(false);
            else {
              setOpenBurgerIcon(true);
            }
          }}
          component={Link}
          href={"/about#about"}
          icon={<IconUser size={14} />}
        >
          Contact Us
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

type NavigationLargeProps = {
  setIsLoading: (val: boolean) => void;
  isLoading: boolean;
  getUserLocation: () => void;
  openlargeScreenMenu: boolean;
  setOpenLargeScreenMenu: (val: boolean) => void;
};
const NavigationLargeScreen: React.FC<NavigationLargeProps> = ({
  setIsLoading,
  isLoading,
  getUserLocation,
  openlargeScreenMenu,
  setOpenLargeScreenMenu,
}) => {
  const router = useRouter();
  const { classes } = useStyles();
  return (
    <Flex direction={"row"} className={classes.rightNavigation}>
      <Menu
        opened={openlargeScreenMenu}
        onChange={() => {
          if (openlargeScreenMenu) setOpenLargeScreenMenu(false);
          else {
            setOpenLargeScreenMenu(true);
          }
        }}
        shadow="md"
      >
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
          <Menu.Item
            onClick={() => {
              setIsLoading(true);
              getUserLocation();
            }}
            closeMenuOnClick={false}
            icon={isLoading ? <Loader size="xs" /> : <IconMapPin size={14} />}
          >
            Near Me
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              router.push("/country/U.S.A");
            }}
            icon={<IconMap size={14} />}
          >
            By States in U.S.A
          </Menu.Item>
          <Menu.Item
            component={Link}
            href={"/#suggestionBox"}
            icon={<IconFileDatabase size={14} />}
          >
            Submit restaurant suggestion
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
          <Menu.Item
            component={Link}
            href={"/about#halal-disclaimer"}
            icon={<IconFileDatabase size={14} />}
          >
            Halal Disclaimer
          </Menu.Item>
          <Menu.Item
            component={Link}
            href={"/about#about"}
            icon={<IconUser size={14} />}
          >
            Contact Us
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  );
};
