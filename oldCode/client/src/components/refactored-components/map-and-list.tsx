import * as React from "react";
import { MapProvider } from "react-map-gl";
import { Grid } from "@mantine/core";

import { MapBoxMap } from "./map";
import { ResultList } from "./list";
import { SearchBar } from "./SearchBar";

export const MapListAndSearchBar: React.FC = () => {
  return (
    <React.Fragment>
      <SearchBar />
      <MapProvider>
        <Grid>
          <Grid.Col md={4} lg={4}>
            <ResultList />
          </Grid.Col>
          <Grid.Col md={8} lg={8}>
            <MapBoxMap />
          </Grid.Col>
        </Grid>
      </MapProvider>
    </React.Fragment>
  );
};
