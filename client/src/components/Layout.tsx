import * as React from "react";
import { HeroBullets } from "./hero-header";
import { SearchInput } from "./search-component";
import { PlacesDisplayComponent } from "./map-layout";
import { DeckDisplayComponent } from "./map-container-2";

export const Layout: React.FC = () => {
  return (
    <React.Fragment>
      <HeroBullets />
      <SearchInput />
      <PlacesDisplayComponent />
      <DeckDisplayComponent />
    </React.Fragment>
  );
};
