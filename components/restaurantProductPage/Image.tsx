import * as React from "react";
import { Flex, Image, SimpleGrid, ScrollArea } from "@mantine/core";

type AllImagesProps = {
  listImageUrls: string[];
};

export const AllImages: React.FC<AllImagesProps> = ({ listImageUrls }) => {
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    listImageUrls[0]
  );

  return (
    <Flex direction={{ base: "column", sm: "row" }} gap="xs">
      <Flex
        gap="xs"
        //justify={"center"}
        align="center"
        direction={{ base: "row", sm: "column" }}
        sx={(theme) => ({
          [theme.fn.smallerThan("sm")]: {
            display: "none",
          },
        })}
      >
        {listImageUrls.map((image) => (
          <Image
            onClick={() => setSelectedImageUrl(image)}
            src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${image}`}
            width={50}
            height={50}
            styles={(theme) => ({
              root: { ":hover": { cursor: "pointer" } },
            })}
          ></Image>
        ))}
      </Flex>
      <ScrollArea
        styles={(theme) => ({
          thumb: {
            background: theme.colors.gray[0],
          },
        })}
        mah={350}
        maw={700}
      >
        <Image
          mah={350}
          maw={700}
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${selectedImageUrl}`}
          alt="restaurant Image"
        />
      </ScrollArea>
      <Flex
        gap="xs"
        justify={"center"}
        align="center"
        direction={{ base: "row", sm: "column" }}
        sx={(theme) => ({
          [theme.fn.largerThan("sm")]: {
            display: "none",
          },
        })}
      >
        {listImageUrls.map((image) => (
          <Image
            onClick={() => setSelectedImageUrl(image)}
            src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${image}`}
            width={50}
            height={50}
            styles={(theme) => ({
              root: { ":hover": { cursor: "pointer" } },
            })}
          ></Image>
        ))}
      </Flex>
    </Flex>
  );
};
