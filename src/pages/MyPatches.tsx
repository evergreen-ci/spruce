import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams } from "types/patch";

export const MyPatches = () => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search);
  const showCommitQueue = parsed.commitQueue === "true" || parsed.commitQueue === undefined;

  function onCheckboxChange() {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search),
        [MyPatchesQueryParams.CommitQueue]: !showCommitQueue
      })}`
    );
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
