import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";

export const MyPatches: React.FC = () => {
  const { search, pathname } = useLocation();
  const history = useHistory();
  const parsed = queryString.parse(search);
  let showCommitQueue = parsed.commitQueue === "true";

  function onCheckboxChange() {
    showCommitQueue = !showCommitQueue;
    history.push({
      pathname: pathname,
      search: "?commitQueue=" + showCommitQueue
    });
  }

  return (
    <div>
      <div>My Patches Page</div>
      <Checkbox
        onChange={onCheckboxChange}
        label="Show Commit Queue"
        checked={showCommitQueue}
      />
    </div>
  );
};
