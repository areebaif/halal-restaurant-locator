import { Group, Image, FileInputProps, Flex } from "@mantine/core";

const Value: React.FC<{ file: File }> = ({ file }) => {
  return (
    <Flex direction="row">
      <Image
        height={120}
        radius="md"
        src={URL.createObjectURL(file)}
        alt="front image"
      />
    </Flex>
  );
};

export const CustomImageButton: FileInputProps["valueComponent"] = ({ value }) => {
  if (Array.isArray(value)) {
    return (
      <Group spacing="sm">
        {value.map((file, index) => (
          <Value file={file} key={index} />
        ))}
      </Group>
    );
  }

  return <Value file={value!} />;
};
