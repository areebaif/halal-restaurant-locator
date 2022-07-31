import * as React from "react";
import { HeroBullets } from "./hero-header";
import SearchInput from "./search-component";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchInput />
    </React.Fragment>
  );
};
