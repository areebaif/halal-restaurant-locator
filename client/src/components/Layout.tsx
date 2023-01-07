import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchBar } from "./refactored-components/SearchBar";
import { MapBoxMap } from "./refactored-components/map";
import { PinIcon } from "../components/icons/pin";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      {<SearchBar />}
    </React.Fragment>
  );
};
