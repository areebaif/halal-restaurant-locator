import * as React from "react";
import Link from "next/link";
import { Button, Image } from "@mantine/core";
// Mantine Imports
import { AppShell, Header, Group, Container, Title, Flex } from "@mantine/core";
import { useRouter } from "next/router";
export const AppChrome: React.FC<React.PropsWithChildren> = (props) => {
  const router = useRouter();
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
            {/*<Flex gap="xl">
               <Link href={"/"}>
                <Image src={"/zt-logo3.png"} height={100} width={100}></Image>{" "}
              </Link> */}

            <Title onClick={() => router.push("/")} py="md" px="sm" order={2}>
              Is it Halal?
            </Title>
            {/*</Flex>
            // TODO: If admin is signed in then Admin Dashborad otherwose Admin Login
             <Link href={"https://www.facebook.com/zahidtown"}>
              <Image src={"/facebook-logo.png"} height={45} width={45}></Image>
            </Link> */}
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
