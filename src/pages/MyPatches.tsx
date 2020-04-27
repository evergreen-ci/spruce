import React, { useState, useEffect } from "react";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import { useLocation, useHistory } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams, ALL_PATCH_STATUS } from "types/patch";
import Icon from "@leafygreen-ui/icon";
import {
  UserPatchesVars,
  UserPatchesData,
  GET_USER_PATCHES,
} from "gql/queries/my-patches";
import { StatusSelector } from "pages/my-patches/StatusSelector";
import { useQuery } from "@apollo/react-hooks";
import { useFilterInputChangeHandler } from "hooks";
import styled from "@emotion/styled";
import get from "lodash/get";
import { PatchCard } from "./my-patches/patch-card-list/PatchCard";

export const MyPatches = () => {
  const { replace, listen } = useHistory();
  const { search, pathname } = useLocation();
  const [initialQueryVariables] = useState<UserPatchesVars>({
    page: 0,
    ...getQueryVariables(search),
  });
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(MyPatchesQueryParams.PatchName);
  const { data, fetchMore, networkStatus, error } = useQuery<
    UserPatchesData,
    UserPatchesVars
  >(GET_USER_PATCHES, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    return listen(async (loc) => {
      try {
        await fetchMore({
          variables: {
            page: 0,
            ...getQueryVariables(loc.search),
          },
          updateQuery: (
            prev: UserPatchesData,
            { fetchMoreResult }: { fetchMoreResult: UserPatchesData }
          ) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return fetchMoreResult;
          },
        });
      } catch (e) {
        // empty block
      }
    });
  }, [networkStatus, error, fetchMore, listen]);

  if (error) {
    return <div>{error.message}</div>;
  }

  const onCheckboxChange = () => {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search, { arrayFormat }),
        [MyPatchesQueryParams.CommitQueue]: !getQueryVariables(search)
          .includeCommitQueue,
      })}`
    );
  };

  return (
    <PageWrapper>
      <PageTitle>My Patches</PageTitle>
      <FiltersWrapperSpaceBetween>
        <FlexRow>
          <StyledInput
            placeholder="Search Test Names"
            onChange={patchNameFilterValueOnChange}
            suffix={<Icon glyph="MagnifyingGlass" />}
            value={patchNameFilterValue}
            data-cy="patchname-input"
            width="25%"
          />
          <StatusSelector />
        </FlexRow>
        <Checkbox
          data-cy="commit-queue-checkbox"
          onChange={onCheckboxChange}
          label="Show Commit Queue"
          checked={getQueryVariables(search).includeCommitQueue}
        />
      </FiltersWrapperSpaceBetween>
      {data
        ? data.userPatches.map((p) => <PatchCard key={p.id} {...p} />)
        : null}
    </PageWrapper>
  );
};

const arrayFormat = "comma";
const LIMIT = 10;
const getQueryVariables = (search: string) => {
  const parsed = queryString.parse(search, { arrayFormat });
  const includeCommitQueue =
    parsed[MyPatchesQueryParams.CommitQueue] === "true" ||
    parsed[MyPatchesQueryParams.CommitQueue] === undefined;
  const patchName = (parsed[MyPatchesQueryParams.PatchName] || "").toString();
  const rawStatuses = parsed[MyPatchesQueryParams.Statuses];
  const statuses = (Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses]
  ).filter((v) => v && v !== ALL_PATCH_STATUS);
  return {
    includeCommitQueue,
    patchName,
    statuses,
    limit: LIMIT,
  };
};

const FlexRow = styled.div`
  display: flex;
  flex-grow: 2;
`;

const FiltersWrapperSpaceBetween = styled(FiltersWrapper)`
  justify-content: space-between;
`;
