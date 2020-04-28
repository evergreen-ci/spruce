import React, { useState, useEffect } from "react";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import { useLocation, useHistory } from "react-router-dom";
import { ErrorWrapper } from "components/ErrorWrapper";
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
import { useFilterInputChangeHandler, usePrevious } from "hooks";
import styled from "@emotion/styled";
import get from "lodash/get";
import { PatchCard } from "./my-patches/PatchCard";
import { Skeleton, Pagination } from "antd";

export const MyPatches = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const [page, setPage] = useState(1);
  const [initialQueryVariables] = useState<UserPatchesVars>({
    page: 0,
    ...getQueryVariables(search),
  });
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(MyPatchesQueryParams.PatchName);
  const { data, fetchMore, error, loading } = useQuery<
    UserPatchesData,
    UserPatchesVars
  >(GET_USER_PATCHES, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });
  const prevSearch = usePrevious(search);
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchMore({
          variables: {
            page: prevSearch !== search ? 0 : page - 1,
            ...getQueryVariables(search),
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
    };
    fetch();
  }, [page, search, prevSearch]);

  const onCheckboxChange = () => {
    replace(
      `${pathname}?${queryString.stringify({
        ...queryString.parse(search, { arrayFormat }),
        [MyPatchesQueryParams.CommitQueue]: !getQueryVariables(search)
          .includeCommitQueue,
      })}`
    );
  };

  const onChange = (page: number) => {
    setPage(page);
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
      <Pagination
        onChange={onChange}
        current={page}
        pageSize={LIMIT}
        total={get(data, "userPatches.filteredPatchCount", 0)}
      />
      <ListContainer>
        {error ? (
          <ErrorWrapper>{error}</ErrorWrapper>
        ) : loading ? (
          <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
        ) : get(data, "userPatches.patches", []).length !== 0 ? (
          data.userPatches.patches.map((p) => <PatchCard key={p.id} {...p} />)
        ) : (
          "No patches found"
        )}
      </ListContainer>
    </PageWrapper>
  );
};

const arrayFormat = "comma";
const LIMIT = 7;
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

const ListContainer = styled.div`
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;
