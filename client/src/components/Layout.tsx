import * as React from "react";
import { HeroBullets } from "./hero-header";
import { UserInputAutoComplete } from "./UserInputAutoComplete";
import { SearchAndMapDisplayComponent } from "./search-map-display";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <UserInputAutoComplete />
      {/*<SearchAndMapDisplayComponent />*/}
    </React.Fragment>
  );
};
