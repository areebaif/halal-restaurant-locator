import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchBar } from "./UserInputAutoComplete";
import { SearchAndMapDisplayComponent } from "./search-map-display";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchBar />
      {/*<SearchAndMapDisplayComponent />*/}
    </React.Fragment>
  );
};
