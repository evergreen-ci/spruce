import React from "react";
import { FiltersWrapper, StyledInput, PageWrapper } from "components/styles";
import { TreeSelect } from "components/TreeSelect";
import { PageTitle } from "components/PageTitle";
import Icon from "@leafygreen-ui/icon";

export const MyPatches = () => {
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
      </FiltersWrapper>
    </PageWrapper>
  );
};
