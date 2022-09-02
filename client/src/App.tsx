import * as React from "react";
import { HeaderAction, HeaderActionProps } from "./components/header";
import { HeroBullets } from "./components/hero-header";
import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <React.Fragment>
      <HeaderAction links={headerLinks.links}></HeaderAction>
      <Routes>
        <Route path="/" element={<Layout />}></Route>
        <Route path="/auth/signup" element={<div>we navigated</div>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
