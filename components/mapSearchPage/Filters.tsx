import { NavLink, Text, Group, Button, Flex, ThemeIcon } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import * as React from "react";

type ClientFilterProps = {
  foodType: string[];
};

export const ClientFilters: React.FC<ClientFilterProps> = ({ foodType }) => {
  return (
    <Flex align="center" pb={5} gap="xs" pt="xs" style={{ overflowX: "auto" }}>
      <ThemeIcon size={"lg"} radius="xs" variant={"light"} color="gray">
        <IconAdjustments />
      </ThemeIcon>

      {foodType.length &&
        foodType.map((item) => (
          <Button
            radius={"xs"}
            sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
            variant="outline"
            color="dark"
            fw={500}
            size="sm"
          >
            {item}
          </Button>
        ))}
    </Flex>
  );
};
