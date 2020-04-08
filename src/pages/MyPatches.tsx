import React from "react";
import { PageWrapper } from "components/styles";
import { PageTitle } from "components/PageTitle";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams } from "types/patch";

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
      <PageTitle
        loading={false}
        hasData={true}
        title="My Patches"
        badge={null}
      />
      <Checkbox
        data-cy="commit-queue-checkbox"
        onChange={onCheckboxChange}
        label="Show Commit Queue"
        checked={showCommitQueue}
      />
    </PageWrapper>
  );
};
