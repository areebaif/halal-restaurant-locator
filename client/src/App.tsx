import * as React from "react";
import { HeaderAction, HeaderActionProps } from "./components/header";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const headerLinks = {
  links: [
    {
      link: "/",
      label: "Features",
      dropDownLinks: [
        { link: "/", label: "Features" },
        { link: "/", label: "Features" },
      ],
    },
    {
      link: "/",
      label: "Features",
    },
  ],
};

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <HeaderAction links={headerLinks.links}></HeaderAction>
        <div>hello</div>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
