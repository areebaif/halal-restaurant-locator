import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchBar } from "./SearchBar";
import { SearchAndMapDisplayComponent } from "./search-map-display";
import { MapBoxMap } from "./map";
import { PinIcon } from "../components/icons/pin";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      {<SearchBar />}
      {/*<SearchAndMapDisplayComponent />*/}
      <PinIcon />
    </React.Fragment>
  );
};
