import React from "react";
import { PageWrapper } from "components/styles";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams } from "types/patch";
import { H1 } from "@leafygreen-ui/typography";

export const MyPatches = () => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search);
  const showCommitQueue =
    parsed.commitQueue === "true" || parsed.commitQueue === undefined;

  const onCheckboxChange = () => {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search),
        [MyPatchesQueryParams.CommitQueue]: !showCommitQueue,
      })}`
    );
  };

  return (
    <PageWrapper>
      <H1>My Patches</H1>
      <Checkbox
        data-cy="commit-queue-checkbox"
        onChange={onCheckboxChange}
        label="Show Commit Queue"
        checked={showCommitQueue}
      />
    </PageWrapper>
  );
};
