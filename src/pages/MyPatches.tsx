import React from "react";
import { FiltersWrapper, StyledInput, PageWrapper } from "components/styles";
import { TreeSelect } from "components/TreeSelect";
import { PageTitle } from "components/PageTitle";
import Icon from "@leafygreen-ui/icon";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams } from "types/patch";

export const MyPatches = () => {
  const { search, pathname } = useLocation();
  const { replace } = useHistory();
  const parsed = queryString.parse(search);
  const showCommitQueue = parsed.commitQueue === "true" || parsed.commitQueue === undefined;

  const onCheckboxChange = () => {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search),
        [MyPatchesQueryParams.CommitQueue]: !showCommitQueue
      })}`
    );
  }

  return (
    <PageWrapper>
      <PageTitle
        loading={false}
        hasData={true}
        title="My Patches"
        badge={null}
      />
      <FiltersWrapper>
        <StyledInput
          data-cy="patch-name-input"
          placeholder="Search Patches"
          suffix={<Icon glyph="MagnifyingGlass" />}
        />
        <TreeSelect
          onChange={null}
          state={[]}
          tData={[]}
          inputLabel="Patch Status: "
          dataCy="patch-status-filter"
        />
        <Checkbox
        data-cy="commit-queue-checkbox"
        onChange={onCheckboxChange}
        label="Show Commit Queue"
        checked={showCommitQueue}
      />
      </FiltersWrapper>
    </PageWrapper>
  )
}
