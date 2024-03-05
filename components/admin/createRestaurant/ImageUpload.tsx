import * as React from "react";
import { Grid, FileInput, Textarea } from "@mantine/core";
import { CustomImageButton } from "./ImageButton";

type ImageUploadProps = {
  coverImage: File | null;
  setCoverImage: (val: File | null) => void;
  images: File[];
  setImages: (val: File[]) => void;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  coverImage,
  setCoverImage,
  images,
  setImages,
}) => {
  return (
    <Grid>
      <Grid.Col span={"auto"}>
        <Textarea
          label="image uploads"
          disabled
          autosize
          defaultValue={
            "restaurant cover image is used for restaurant card displayed with map. The other images are used to show viewers the seating area and the outside area of the restaurant. Cover image is a required image for form submission."
          }
        />
      </Grid.Col>
      <Grid.Col span={"auto"}>
        <FileInput
          placeholder="select .png or .jpeg"
          label="cover"
          variant={`${coverImage ? "unstyled" : "default"}`}
          withAsterisk
          value={coverImage}
          valueComponent={CustomImageButton}
          onChange={setCoverImage}
        />
      </Grid.Col>
      <Grid.Col span={"auto"}>
        <FileInput
          multiple
          variant={`${images.length ? "unstyled" : "default"}`}
          placeholder="select .png or .jpeg"
          label="select multiple images"
          value={images}
          valueComponent={CustomImageButton}
          onChange={setImages}
        />
      </Grid.Col>
    </Grid>
  );
};
