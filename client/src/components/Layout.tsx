import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchAndMapDisplayComponent } from "./search-map-display"

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchAndMapDisplayComponent />
    </React.Fragment>
  );
};
