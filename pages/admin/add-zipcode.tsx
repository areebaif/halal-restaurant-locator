import * as React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
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
  Container,
} from "@mantine/core";
import { ErrorCard } from "@/components";
import {
  postAddZipcode,
  getCities,
  ReadCityDbZod,
  ResponseAddZipcodeZod,
} from "@/utils";
import { PostAddZipcode, ResponseAddZipcode } from "@/utils/types";

export const AddZipcode: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [zipcode, setZipcode] = React.useState("");
  const [countryStateCity, setCountryStateCity] = React.useState("");
  const [allZipcode, setAllZipcode] = React.useState<PostAddZipcode>([]);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [error, setError] = React.useState<ResponseAddZipcode>();

  // Queries
  const apiData = useQuery(["getAllCities"], getCities, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const mutation = useMutation({
    mutationFn: postAddZipcode,
    onSuccess: (data) => {
      const result = ResponseAddZipcodeZod.safeParse(data);
      if (!result.success) {
        console.log(result.error);
        return <ErrorCard message="unable to add zipcode, please try again" />;
      }
      if (!data.created) {
        console.log(`error:`, data);
        if (data.country) setError({ ...error, country: data.country });
        if (data.state) setError({ ...error, state: data.state });
        if (data.city) setError({ ...error, state: data.city });
        if (data.zipcode) setError({ ...error, state: data.zipcode });
        if (data.typeError) setError({ ...error, typeError: data.typeError });
        return;
      }
      router.push("/admin");
      queryClient.invalidateQueries();
    },
    onError: (data) => {},
  });

  if (apiData.isLoading) return <Loader />;
  if (apiData.isError) {
    console.log(apiData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }
  const isTypeCorrect = ReadCityDbZod.safeParse(apiData.data);

  if (!isTypeCorrect.success) {
    console.log(isTypeCorrect.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }
  if (mutation.isLoading) {
    return <Loader />;
  }

  const autoCompleteCountryStateCity = apiData.data.map((item) => ({
    value: item.countryStateCityName,
    countryid: item.countryId,
    stateid: item.stateId,
    cityid: item.cityId,
  }));

  const onSubmit = async (val: PostAddZipcode) => {
    setError(undefined);
    if (!val.length) {
      setError({
        ...error,
        country:
          "Please add values before submitting. There is not value to submit in the form",
      });
      return;
    }

    mutation.mutate(val);
  };

  const onAddZipcode = (data: {
    zipcodeVal: string;
    latitude: string;
    longitude: string;
  }) => {
    setError(undefined);
    const { zipcodeVal, latitude, longitude } = data;
    const latNum = Number(latitude);
    const longNum = Number(longitude);

    if (!zipcodeVal.length || !Boolean(latNum) || !Boolean(longNum)) {
      setError({
        ...error,
        zipcode:
          "Latitude and longitude values should be decimal numbers and zipcode cannot be empty",
      });
      return;
    }

    const countryStateIdArray = autoCompleteCountryStateCity.filter(
      (item) => item.value === countryStateCity
    );

    if (!countryStateIdArray.length) {
      setError({
        ...error,
        country: "please select value in country - state - city field",
      });
      return;
    }
    const countryId = countryStateIdArray[0].countryid;
    const stateId = countryStateIdArray[0].stateid;
    const cityId = countryStateIdArray[0].cityid;
    let index;
    const filterCity = allZipcode.filter((item, itemIndex) => {
      if (item.cityId === cityId) {
        // we need the index to push zipcode to approriate city
        index = itemIndex;
      }
      return item.cityId === cityId;
    });
    const zipcode = {
      zipcode: zipcodeVal,
      latitude: latNum,
      longitude: longNum,
    };
    if (filterCity.length) {
      const updateAllZipcode = [...allZipcode];
      updateAllZipcode[index!].zipcode.push(zipcode);
      setAllZipcode([...updateAllZipcode]);
    } else {
      const updateAllZipcode = [...allZipcode];

      updateAllZipcode.push({
        countryId: countryId,
        stateId: stateId,
        cityId: cityId,
        countryStateCity: countryStateCity,
        zipcode: [zipcode],
      });
      setAllZipcode(updateAllZipcode);
    }
    setZipcode("");
    setLatitude("");
    setLongitude("");
    setCountryStateCity("");
  };

  return (
    <Card
      shadow="sm"
      p="lg"
      radius="md"
      withBorder
      style={{
        overflow: "inherit",
        margin: "15px 0 0 0",
      }}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Title order={3}>Add Zipcode</Title>
      </Card.Section>
      <Grid>
        <Grid.Col span={4}>
          <Autocomplete
            mt="sm"
            withAsterisk
            description="select from a list of: country - state - city"
            placeholder="select country - state - city"
            label={"country - state - city"}
            data={autoCompleteCountryStateCity}
            value={countryStateCity}
            onChange={setCountryStateCity}
          />
          {error?.country ? <ErrorCard message={error?.country} /> : <></>}
          {error?.state ? <ErrorCard message={error?.state} /> : <></>}
          {error?.city ? <ErrorCard message={error?.city} /> : <></>}
        </Grid.Col>
        <Grid.Col span={"auto"}>
          <TextInput
            mt="sm"
            withAsterisk
            value={zipcode}
            description="5 digit zipcode"
            label="zipcode"
            placeholder="type here"
            type="text"
            onChange={(event) => setZipcode(event.currentTarget.value)}
          ></TextInput>
        </Grid.Col>
        <Grid.Col span="auto">
          <TextInput
            mt="sm"
            withAsterisk
            label="latitude"
            description="latitude range -90 to 90"
            value={latitude}
            onChange={(e) => setLatitude(e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span="auto">
          <TextInput
            mt="sm"
            withAsterisk
            label="longitude"
            description="longitude range -180 to 180."
            value={longitude}
            onChange={(e) => setLongitude(e.currentTarget.value)}
            onKeyDown={(event) => {
              event.key === "Enter"
                ? onAddZipcode({ zipcodeVal: zipcode, latitude, longitude })
                : undefined;
            }}
          />
        </Grid.Col>
      </Grid>
      {error?.zipcode ? <ErrorCard message={error?.zipcode} /> : <></>}
      {error?.typeError ? <ErrorCard message={error?.typeError} /> : <></>}
      <Container size="sm">
        <Grid ml="xl">
          <Grid.Col span={"auto"}>
            <Textarea
              defaultValue="Select country - state - city to add multiple zipcodes. You can add multiple zipcodes for one country in a single form submission."
              mt="md"
              minRows={3}
              disabled
            ></Textarea>
          </Grid.Col>
          <Grid.Col span={"auto"}>
            <Box pt="md" mt="md">
              <Button
                mt="sm"
                variant="outline"
                color="dark"
                size="sm"
                onClick={() =>
                  onAddZipcode({ zipcodeVal: zipcode, latitude, longitude })
                }
              >
                Add
              </Button>
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
      {allZipcode.length ? (
        <>
          <DisplayZipcode
            allZipcode={allZipcode}
            setAllZipcode={setAllZipcode}
          />
          <Group position="center" mt="sm">
            <Button color="dark" size="sm" onClick={() => onSubmit(allZipcode)}>
              Submit
            </Button>
          </Group>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
};

export default AddZipcode;


type DisplayZipcodeProps = {
  allZipcode: PostAddZipcode;
  setAllZipcode: (val: PostAddZipcode) => void;
};
export const DisplayZipcode: React.FC<DisplayZipcodeProps> = ({
  allZipcode,
  setAllZipcode,
}) => {
  const onDelete = (countryStateCity: string, zipcode: string) => {
    const updateAllCity = [...allZipcode];
    const newZipcode = updateAllCity.map((item) => {
      if (item.countryStateCity === countryStateCity) {
        const filteredZipcode = item.zipcode.filter(
          (item) => item.zipcode !== zipcode
        );
        return {
          countryId: item.countryId,
          stateId: item.stateId,
          cityId: item.cityId,
          countryStateCity: item.countryStateCity,
          zipcode: [...filteredZipcode],
        };
      } else return { ...item };
    });

    setAllZipcode([...newZipcode]);
  };

  return (
    <Table mt="xl" fontSize="lg" highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Country - State</th>
          <th>Zipcode</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Delete</th>
        </tr>
      </thead>

      {allZipcode.map((item, index) => (
        <tbody key={index}>
          {item.zipcode.map((zipcode, index) => (
            <tr key={index}>
              <td>{item.countryStateCity}</td>
              <td>{zipcode.zipcode}</td>
              <td>{zipcode.latitude}</td>
              <td>{zipcode.longitude}</td>
              <td>
                <Button
                  onClick={() =>
                    onDelete(item.countryStateCity, zipcode.zipcode)
                  }
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      ))}
    </Table>
  );
};
