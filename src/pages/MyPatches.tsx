import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams } from "types/task";

export const MyPatches = () => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search);
  let showCommitQueue = parsed.commitQueue
    ? parsed.commitQueue === "true"
    : true;

  function onCheckboxChange() {
    showCommitQueue = !showCommitQueue;
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search),
        [MyPatchesQueryParams.CommitQueue]: showCommitQueue
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
