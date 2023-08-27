import * as React from "react";
import Link from "next/link";
import { Image } from "@mantine/core";
// Mantine Imports
import { AppShell, Header, Group, Container, Title, Flex } from "@mantine/core";
// import {
//   IconMessages,
//   IconDatabase,
//   IconLogin,
//   IconAlertCircle,
// } from "@tabler/icons-react";
export const AppChrome: React.FC<React.PropsWithChildren> = (props) => {
  return (
    <AppShell
      //padding="md"
      header={
        <Header
          px="xl"
          height={70}
          sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
        >
          <Group position="apart">
            <Flex gap="xl">
              {/* <Link href={"/"}>
                <Image src={"/zt-logo3.png"} height={100} width={100}></Image>{" "}
              </Link> */}
              <Link href={"/"}>
                <Title py="md" order={2}>
                  Is it Halal?
                </Title>
              </Link>
            </Flex>
            {/* <Link href={"https://www.facebook.com/zahidtown"}>
              <Image src={"/facebook-logo.png"} height={45} width={45}></Image>
            </Link> */}
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
