import { Flex, ThemeIcon, Chip } from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import * as React from "react";

type ClientFilterProps = {
  AllFoodFilterVal: string[];
  foodTypeFilters: string[];
  setFoodTypeFilters: (val: string[]) => void;
};

export const ClientFilters: React.FC<ClientFilterProps> = ({
  foodTypeFilters,
  setFoodTypeFilters,
  AllFoodFilterVal,
}) => {
  return (
    <Flex pb={5} gap="xs" pt="xs" style={{ overflowX: "auto" }}>
      <ThemeIcon size={"lg"} radius="xs" variant={"light"} color="gray">
        <IconAdjustments />
      </ThemeIcon>
      <Chip.Group
        multiple
        value={foodTypeFilters}
        onChange={setFoodTypeFilters}
      >
        {AllFoodFilterVal.length &&
          AllFoodFilterVal.map((item, index) => (
            <Chip
              key={index}
              style={{ display: "inline-flex" }}
              radius={"xs"}
              value={item}
              //sx={(theme) => ({ backgroundColor: theme.colors.gray[0] })}
              variant="outline"
              color="dark"
              //fw={500}
              //size="sm"
            >
              {item}
            </Chip>
          ))}
      </Chip.Group>
    </Flex>
  );
};
