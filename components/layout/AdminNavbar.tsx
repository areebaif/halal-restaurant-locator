import { useRouter } from "next/router";
import {
  Navbar,
  ThemeIcon,
  UnstyledButton,
  Group,
  Text,
  useMantineTheme,
} from "@mantine/core";
import {
  IconMessages,
  IconDatabase,
  IconLogin,
  IconAlertCircle,
  IconUser,
  IconEditCircle,
  IconUserPlus,
  IconDeviceGamepad,
  IconIdBadge2,
  IconTemplate,
  IconPlaylistAdd,
  IconMap2,
  IconMapPin,
  IconMapPin2,
  IconMapPins,
  IconMap,
} from "@tabler/icons-react";

export const AdminNavigation: React.FC = (props) => {
  //const user = props!;
  return (
    <Navbar p="xs" width={{ base: 275 }}>
      <Navbar.Section px="md" grow mt="md">
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.dark,
          })}
        >
          Restaurant
        </Text>
        <RestaurantMainLinks />
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.dark,
          })}
        >
          Geography
        </Text>
        <GeographyMainLinks />
        <Text
          size="sm"
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[2]
                : theme.colors.dark,
          })}
        >
          User
        </Text>
        <UserMainLinks />
      </Navbar.Section>

      {/* TODO: this is the user card
       <Navbar.Section>
          <User {...user} />
        </Navbar.Section> */}
    </Navbar>
  );
};

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({ icon, color, label, link }: MainLinkProps) {
  const router = useRouter();
  const theme = useMantineTheme();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        // color:
        //   theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
      onClick={() => {
        router.push(link);
      }}
    >
      <Group>
        <ThemeIcon
          color={color}
          variant={theme.colorScheme === "dark" ? "dark" : "light"}
        >
          {icon}
        </ThemeIcon>
        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const restaurantData = [
  {
    icon: <IconDatabase size={16} />,
    color: "pink",
    label: "Add restaurant",
    link: "/admin/add-restaurant",
  },
  {
    icon: <IconDeviceGamepad size={16} />,
    color: "violet",
    label: "View /Edit restaurant",
    link: "/admin",
  },

  {
    icon: <IconIdBadge2 size={16} />,
    color: "green",
    label: "Add type of food",
    link: "/admin/add-food-tag",
  },
];

const userData = [
  {
    icon: <IconUserPlus size={16} />,
    color: "pink",
    label: "Add user",
    link: "/admin/add-user",
  },
  {
    icon: <IconUser size={16} />,
    color: "grape",
    label: "Profile /Reset password",
    link: "/admin/edit-user-password",
  },
  {
    icon: <IconLogin size={16} />,
    color: "indigo",
    label: "Logout",
    link: "/admin/logout",
  },
];

const geographyData = [
  {
    icon: <IconMap2 size={16} />,
    color: "indigo",
    label: "Add City",
    link: "/admin/add-city",
  },
  {
    icon: <IconMapPins size={16} />,
    color: "violet",
    label: "Add Zipcode",
    link: "/admin/add-zipcode",
  },
];

export function RestaurantMainLinks() {
  const links = restaurantData.map((link) => (
    <MainLink {...link} key={link.label} />
  ));
  return <div>{links}</div>;
}

export function GeographyMainLinks() {
  const links = geographyData.map((link) => (
    <MainLink {...link} key={link.label} />
  ));
  return <div>{links}</div>;
}

export function UserMainLinks() {
  const links = userData.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
