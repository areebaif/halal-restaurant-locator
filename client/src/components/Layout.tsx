import * as React from "react";
import { HeroBullets } from "./hero-header";
import SearchInput from "./search-component";
import { MapContainer } from "./map-container";
export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchInput />
      <MapContainer />
    </React.Fragment>
  );
};
