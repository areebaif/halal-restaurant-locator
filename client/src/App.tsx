import * as React from "react";
//import { useState } from 'react';
import { Select } from "@mantine/core";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { HeaderAction, HeaderActionProps } from "./components/header";
import { Routes, Route } from "react-router-dom";
import { SearchBar } from "./components/refactored-components/SearchBar";
import { Layout } from "./components/Layout";
import { config } from "dotenv";
import { MapListAndSearchBar } from "./components/refactored-components/map-and-list";

const headerLinks = {
  links: [
    {
      link: "/",
      label: "Restaurants",
      dropDownLinks: [
        { link: "/", label: "Features" },
        { link: "/", label: "Features" },
      ],
    },
    {
      link: "/auth/signup",
      label: "Catering",
    },
    {
      link: "/auth/signup",
      label: "Grocery",
    },
  ],
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// export const Test: React.FC<{}> = () => {
//   const [data, setData] = React.useState([
//     { value: "react", label: "React" },
//     { value: "ng", label: "Angular" },
//   ]);

//   return (
//     <Select
//       label="Creatable Select"
//       data={data}
//       placeholder="Select items"
//       nothingFound="Nothing found"
//       searchable
//       creatable
//       getCreateLabel={(query) => `+ Create ${query}`}
//       onCreate={(query) => {
//         const item = { value: query, label: query };
//         setData((current) => [...current, item]);
//         return item;
//       }}
//     />
//   );
// };

function App() {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <HeaderAction links={headerLinks.links}></HeaderAction>
        <Routes>
          <Route path="/" element={<Layout />}></Route>
          <Route path="/auth/signup" element={<div>we navigated</div>}></Route>
          <Route
            path="/search-display"
            element={<MapListAndSearchBar />}
          ></Route>
        </Routes>
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
