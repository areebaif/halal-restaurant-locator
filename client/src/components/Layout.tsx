import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchInput } from "./search-component";
import { SearchAndMapDisplayComponent } from "./map-layout";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchInput />
      <SearchAndMapDisplayComponent />
    </React.Fragment>
  );
};
