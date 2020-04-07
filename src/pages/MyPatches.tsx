import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";

export const MyPatches = () => {
  const { search, pathname } = useLocation();
  const history = useHistory();
  const parsed = queryString.parse(search);
  let showCommitQueue = parsed.commitQueue === "true";
  return (
    <div>
      <div>My Patches Page</div>
      <Checkbox
        onChange={() => {
          showCommitQueue = !showCommitQueue;
          history.push({
            pathname: pathname,
            search: "?commitQueue=" + showCommitQueue
          });
        }}
        label="Show Commit Queue"
        checked={showCommitQueue}
      />
    </div>
  );
};
