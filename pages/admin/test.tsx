import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Card,
  Title,
  TextInput,
  Group,
  Button,
  Textarea,
  Grid,
  Loader,
  Autocomplete,
  Box,
  Table,
  Image,
} from "@mantine/core";
import { useRouter } from "next/router";
import { ErrorCard } from "@/components";
import {
  ReadCountriesDbZod,
  capitalizeFirstWord,
  ResponseAddStateZod,
  getAllCountries,
  postAddState,
  s3Client,
} from "@/utils";
import { PostAddState, ResponseAddState } from "@/utils/types";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

const AddState: React.FC = () => {
  return (
    <Image src="https://halal-restaurant-locator.s3.amazonaws.com/fc1c76e8-2127-4599-bba4-f98b57272de3/cover/75ad6943-3ee4-4b3f-a76b-f301dc250339.png" />
  );
};

export default AddState;
