import * as React from "react";
import Link from "next/link";
import {
  MediaQuery,
  Title,
  Box,
  Divider,
  createStyles,
  Text,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  textInput: {
    input: {
      "&:focus": { border: "1px solid gray" },
      border: "1px solid black",
    },
  },
}));

export const About: React.FC = () => {
  return (
    <>
      <Box id="halal-disclaimer">
        {" "}
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h2"} order={1}>
            {" "}
            Halal disclaimer
          </Title>
        </MediaQuery>
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h3"} order={1}>
            {" "}
            Halal disclaimer
          </Title>
        </MediaQuery>
      </Box>
      <Divider my="xs" />
      <Text size="md">
        This website only provides a tentative list of halal restaurants in
        U.S.A. As such, the website is meant as a starting point for potential
        halal restaurants available in U.S.A.
      </Text>
      <Text py="sm" size="md">
        {" "}
        Please do your own diligence on specific halal standards followed by a
        particular restaurant.
      </Text>

      <Box id="about">
        {" "}
        <MediaQuery smallerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h2"} order={1}>
            {" "}
            Contact us
          </Title>
        </MediaQuery>
        <MediaQuery largerThan={"md"} styles={{ display: "none" }}>
          <Title size={"h3"} order={1}>
            {" "}
            Contact us
          </Title>
        </MediaQuery>
      </Box>
      <Divider my="xs" />
    </>
  );
};

// export const ContactUsForm: React.FC = ({
//   name,
//   setName,
//   adress,
//   setAdress,
//   isError,
//   onSendEmail,
// }) => {
//   const { classes } = useStyles();
//   return (
//     <>
//       <TextInput
//         className={classes.textInput}
//         mt="xs"
//         placeholder="name"
//         withAsterisk
//         value={name}
//         onChange={(event) => setName(event.currentTarget.value)}
//       />
//       <TextInput
//         mt="sm"
//         className={classes.textInput}
//         placeholder="adress"
//         withAsterisk
//         value={adress}
//         onChange={(event) => setAdress(event.currentTarget.value)}
//       />
//       {isError && (
//         <ErrorCard message="please enter subject and query to continue" />
//       )}
//       <Center>
//         <Button
//           mt="md"
//           component={Link}
//           variant="outline"
//           color="dark"
//           // TODO: fix the mailTo
//           onClick={(e) => onSendEmail(e)}
//           href={`mailto:jamie@fakeemail.com?subject=Restaurant Suggestion&body=Hi,%0D%0DRestaurantName: ${name} %0D%0DAdress: ${adress}`}
//           target="_blank"
//         >
//           Send suggestion as email
//         </Button>
//       </Center>
//     </>
//   );
// };

export default About;
