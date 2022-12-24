import * as React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { HeaderAction, HeaderActionProps } from "./components/header";
import { Routes, Route } from "react-router-dom";
import { SearchBar } from "./components/SearchBar";
import { Layout } from "./components/Layout";
import { config } from "dotenv";

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
            element={
              <div>
                yoho we navigated <SearchBar />
              </div>
            }
          ></Route>
        </Routes>
      </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
