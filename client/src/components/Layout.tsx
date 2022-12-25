import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchBar } from "./SearchBar";
import { SearchAndMapDisplayComponent } from "./search-map-display";
import { MapBoxMap } from "./map";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchBar />
      {<MapBoxMap />}
    </React.Fragment>
  );
};
