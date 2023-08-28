import * as React from "react";
import Link from "next/link";
import { Button, Image } from "@mantine/core";
// Mantine Imports
import { AppShell, Header, Group, Container, Title } from "@mantine/core";
import { AdminNavigation } from "..";

export const AppChromeAdmin: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AppShell
      //padding="md"
      navbar={<AdminNavigation />}
      header={
        <Header
          px="md"
          py="md"
          height={70}
          //sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
        >
          <Group position="apart">
            <Link href={"/"}>
              <Title px="sm" order={2}>
                Is it Halal?
              </Title>
            </Link>
            <Link href="/admin">
              <Button
                px="xl"
                mx="xs"
                variant="outline"
                color="dark"
                radius="sm"
              >
                Admin Dashboard
              </Button>
            </Link>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Container fluid>{props.children}</Container>
    </AppShell>
  );
};
