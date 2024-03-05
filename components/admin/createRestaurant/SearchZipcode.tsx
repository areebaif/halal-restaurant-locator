import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Group,
  TextInput,
  Textarea,
  Button,
  Grid,
  Loader,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import { getZipcode, GetZipCodeResponseZod, onlyNumbers } from "@/utils";

import { GetZipcode, GetZipcodeError } from "@/utils/types";

export const SearchZipcode: React.FC = () => {
  const [zipcode, setZipcode] = React.useState("");
  const [errors, setErrors] = React.useState(false);
  const [getApiFlag, setGetApiFlag] = React.useState(false);
  const [displayZipcodeCard, setDisplayZipcodeCard] = React.useState(false);
  const [errorVal, setErrorVal] = React.useState<{ zipcode: string[] }>({
    zipcode: [],
  });
  const zipcodeVal = useQuery(
    ["getZipcode", zipcode],
    () => getZipcode(zipcode),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      enabled: getApiFlag ,
      onSuccess: (data) => {
        setGetApiFlag(false);
        const isTypeCorrentZipcode = GetZipCodeResponseZod.safeParse(data);
        if (!isTypeCorrentZipcode.success) {
          setErrors(true);
          setErrorVal({
            zipcode: [...errorVal.zipcode, "type mismatch from server"],
          });
        }
        // this means we have the correct data to display
        if (!data.hasOwnProperty("apiErrors")) {
          setDisplayZipcodeCard(true);
        }
      },
    }
  );

  if (zipcodeVal.isInitialLoading) return <Loader />;

  if (zipcodeVal.isError) {
    console.log(zipcodeVal.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }

  if (zipcodeVal.data?.hasOwnProperty("apiErrors")) {
    const apiErrors = zipcodeVal.data as GetZipcodeError;
    if (apiErrors.apiErrors?.validationErrors) {
      setErrorVal({
        zipcode: [
          ...errorVal.zipcode,
          ...apiErrors.apiErrors?.validationErrors.zipcode,
        ],
      });
    }
    if (apiErrors.apiErrors?.generalError) {
      setErrorVal({
        zipcode: [...errorVal.zipcode, ...apiErrors.apiErrors?.generalError],
      });
    }
    setErrors(true);
  }

  const zipcodeApiResponse = zipcodeVal.data as GetZipcode;

  const onSubmit = (zipcode: string) => {
    //validation
    setErrors(false);
    if (!zipcode.length) {
      setErrorVal({
        zipcode: [...errorVal.zipcode, "enter value for zipcode"],
      });
      setErrors(true);
      return;
    }
    if (!onlyNumbers(zipcode) || zipcode.length !== 5) {
      setErrorVal({
        zipcode: [...errorVal.zipcode, "enter five digit valid zipcode"],
      });
      setErrors(true);
      return;
    }
    setGetApiFlag(true);
    if (zipcodeApiResponse && zipcodeApiResponse.zipcode) {
      setDisplayZipcodeCard(true);
    }
  };

  return displayZipcodeCard ? (
    <GetZipcodeDisplayCard
      data={zipcodeApiResponse.zipcode}
      setDisplayZipcodeCard={setDisplayZipcodeCard}
      setZipcode={setZipcode}
      setGetApiFlag={setGetApiFlag}
    />
  ) : (
    <Grid mt="xs">
      <Grid.Col span={2}>
        <Textarea
          label={"zipcode"}
          defaultValue="search five digit zipcode to auto populate the state and city."
          disabled
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <TextInput
          mt="md"
          value={zipcode}
          onChange={(event) => setZipcode(event.currentTarget.value)}
          label={"search"}
          placeholder="five digit zipcode"
        ></TextInput>
        {errors && <ErrorCard arrayOfErrors={errorVal.zipcode} />}
      </Grid.Col>
      <Grid.Col span={2}>
        <Button
          sx={(theme) => ({
            marginTop: `calc(${theme.spacing.lg}*2)`,
          })}
          variant="outline"
          color="dark"
          onClick={() => onSubmit(zipcode)}
        >
          Search
        </Button>
      </Grid.Col>
    </Grid>
  );
};

type GetZipcodeDisplayCardProps = {
  data: GetZipcode["zipcode"];
  setDisplayZipcodeCard: (val: boolean) => void;
  setZipcode: (val: string) => void;
  setGetApiFlag: (val: boolean) => void;
};

export const GetZipcodeDisplayCard: React.FC<GetZipcodeDisplayCardProps> = ({
  data,
  setDisplayZipcodeCard,
  setZipcode,
  setGetApiFlag,
}) => {
  return (
    <Grid mt="xs">
      <Grid.Col span={3}>
        <Textarea
          label={"zipcode"}
          defaultValue="use back button to search for new zipcode"
          maxRows={1}
          disabled
          withAsterisk
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <TextInput
          label="city-state-zipcode-country"
          defaultValue={`${data.cityName}, ${data.stateName}, ${data.zipcode}, ${data.countryName}`}
          disabled
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Button
          sx={(theme) => ({
            marginTop: theme.spacing.xl,
          })}
          variant="outline"
          color="dark"
          onClick={() => {
            setZipcode("");
            setDisplayZipcodeCard(false);
            setGetApiFlag(false);
          }}
        >
          Back
        </Button>
      </Grid.Col>
    </Grid>
  );
};
