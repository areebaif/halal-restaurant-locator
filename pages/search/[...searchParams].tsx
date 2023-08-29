import * as React from "react";
import { useRouter } from "next/router";

import { parseQueryVals } from "@/utils/string-manipulation";
import { PostSearchInputs } from "@/utils/types";

const MapSearch: React.FC = () => {
  const router = useRouter();
  const urlParams = router.query.searchParams as string[];
  const [searchInput, setSearchInput] = React.useState<PostSearchInputs>();

  React.useEffect(() => {
    if (urlParams) {
      const queryVal = urlParams[0];
      const result = parseQueryVals(queryVal);
      setSearchInput(result);
    }
  }, [urlParams]);

  console.log(urlParams, urlParams);
  //const queryParams = urlParams.length;

  return <div>I navigated to blah</div>;
};

export default MapSearch;
