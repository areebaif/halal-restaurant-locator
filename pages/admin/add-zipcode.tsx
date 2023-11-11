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
  capitalizeFirstWord,
  PostAddZipcodeZod,
  ResponseAddCityZod,
  getCities,
  ReadCityDbZod,
} from "@/utils";
import { ResponseAddCity, PostAddZipcode } from "@/utils/types";

export const AddZipcode: React.FC = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [zipcode, setZipcode] = React.useState("");
  const [countryStateCity, setCountryStateCity] = React.useState("");
  const [allZipcode, setAllZipcode] = React.useState<PostAddZipcode>([]);
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const [error, setError] = React.useState<ResponseAddCity>();

  // Queries
  const apiData = useQuery(["getAllCities"], getCities, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  //   const mutation = useMutation({
  //     mutationFn: postAddCity,
  //     onSuccess: (data) => {
  //       const result = ResponseAddCityZod.safeParse(data);
  //       if (!result.success) {
  //         console.log(result.error);
  //         return <ErrorCard message="unable to add zipcode, please try again" />;
  //       }
  //       if (!data.created) {
  //         console.log(`error:`, data);
  //         if (data.country) setError({ ...error, country: data.country });
  //         if (data.state) setError({ ...error, state: data.state });
  //         if (data.city) setError({ ...error, state: data.city });
  //         if (data.typeError) setError({ ...error, typeError: data.typeError });
  //         return;
  //       }
  //       router.push("/admin");
  //       queryClient.invalidateQueries();
  //     },
  //     onError: (data) => {},
  //   });

  if (apiData.isLoading) return <Loader />;
  if (apiData.isError) {
    console.log(apiData.error);
    return <ErrorCard message="something went wrong with the api request" />;
  }
  const isStateTypeCorrent = ReadCityDbZod.safeParse(apiData.data);

  if (!isStateTypeCorrent.success) {
    console.log(isStateTypeCorrent.error);
    return <ErrorCard message="Their is a type mismatch from the server" />;
  }
  //   if (mutation.isLoading) {
  //     return <Loader />;
  //   }

  const autoCompleteCountryStateCity = apiData.data.map((item) => ({
    value: item.countryStateCityName,
    countryid: item.countryId,
    stateid: item.stateId,
    cityid: item.cityId,
  }));

  const onSubmit = async (val: PostAddZipcode) => {
    setError(undefined);
    if (!val.length || val.length > 1) {
      setError({
        ...error,
        country: "Please add state to a single country",
      });
      return;
    }

    //mutate(val);
  };

  const onAddZipcode = (data: {
    zipcodeVal: string;
    latitude: string;
    longitude: string;
  }) => {
    const { zipcodeVal, latitude, longitude } = data;
    const latNum = Number(latitude);
    const longNum = Number(longitude);

    if (!zipcodeVal.length || !Boolean(latNum) || !Boolean(longNum)) {
      // TODO: I have to do error handling
    }

    const countryStateIdArray = autoCompleteCountryStateCity.filter(
      (item) => item.value === countryStateCity
    );
    // TODO: error handling if country is not defined
    if (!countryStateIdArray.length) {
      console.log(" I have to do eror handling");
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
        <Grid.Col span={"auto"}>
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
          {error?.city ? <ErrorCard message={error?.city} /> : <></>}
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
            description="longitude range -180 to 180. Press enter to add"
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
      {/* <DisplayCities allCity={allZipcode} setAllCity={setAllZipcode} /> */}
      <Group position="center" mt="sm">
        <Button color="dark" size="sm" onClick={() => onSubmit(allZipcode)}>
          Submit
        </Button>
      </Group>
    </Card>
  );
};

export default AddZipcode;

// type DisplayCityProps = {
//   allCity: PostAddCity;
//   setAllCity: (val: PostAddCity) => void;
// };
// export const DisplayCities: React.FC<DisplayCityProps> = ({
//   allCity,
//   setAllCity,
// }) => {
//   const onDelete = (countryState: string, city: string) => {
//     const updateAllCity = [...allCity];
//     const newCity = updateAllCity.map((item) => {
//       if (item.countryState === countryState) {
//         const filteredCities = item.cityName.filter((item) => item !== city);
//         return {
//           countryId: item.countryId,
//           stateId: item.stateId,
//           countryState: item.countryState,
//           cityName: [...filteredCities],
//         };
//       } else return { ...item };
//     });
//     // TODO: error handling if countryState not found
//     setAllCity([...newCity]);
//   };

//   return allCity.length ? (
//     <Table mt="xl" fontSize="lg" highlightOnHover withBorder>
//       <thead>
//         <tr>
//           <th>Country - State</th>
//           <th>City</th>
//           <th>Delete</th>
//         </tr>
//       </thead>

//       {allCity.map((item, index) => (
//         <tbody key={index}>
//           {item.cityName.map((city, index) => (
//             <tr key={index}>
//               <td>{item.countryState}</td>
//               <td>{city}</td>
//               <td>
//                 <Button onClick={() => onDelete(item.countryState, city)}>
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       ))}
//     </Table>
//   ) : (
//     <></>
//   );
// };
