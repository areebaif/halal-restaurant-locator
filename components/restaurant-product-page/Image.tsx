import * as React from "react";
import { Flex, Image, AspectRatio, Grid, ScrollArea, Box } from "@mantine/core";

type AllImagesProps = {
  listImageUrls: string[];
};

export const AllImages: React.FC<AllImagesProps> = ({ listImageUrls }) => {
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(
    listImageUrls[0]
  );

  return (
    <Flex gap="md">
      <Flex direction={"column"}>
        {" "}
        {listImageUrls.map((image) => (
          <Image
            onClick={() => setSelectedImageUrl(image)}
            src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${image}`}
            width={50}
            height={50}
            radius={"md"}
            mb="sm"
            styles={(theme) => ({
              root: { ":hover": { cursor: "pointer" } },
              image: { border: "1px solid" },
            })}
          ></Image>
        ))}
      </Flex>
      <ScrollArea mah={400} maw={400}>
        <Image
          mah={400}
          maw={400}
          src={`${process.env.NEXT_PUBLIC_BASE_IMAGE_URL}/${selectedImageUrl}`}
          alt="restaurant Image"
        />
      </ScrollArea>
    </Flex>
  );
};
