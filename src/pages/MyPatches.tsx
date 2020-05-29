import React, { useState } from "react";
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
import { GET_USER_PATCHES } from "gql/queries/my-patches";
import {
  UserPatchesQueryVariables,
  UserPatchesQuery,
} from "gql/generated/types";
import { StatusSelector } from "pages/my-patches/StatusSelector";
import { useQuery } from "@apollo/react-hooks";
import { useFilterInputChangeHandler, usePollTableQuery } from "hooks";
import styled from "@emotion/styled";
import get from "lodash/get";
import { Skeleton } from "antd";
import { PatchCard } from "pages/my-patches/PatchCard";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

export const MyPatches: React.FC = () => {
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const [initialQueryVariables] = useState<UserPatchesQueryVariables>(
    getQueryVariables(search)
  );
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(MyPatchesQueryParams.PatchName);
  const { data, refetch, networkStatus, error } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });
  const { showSkeleton } = usePollTableQuery({
    networkStatus,
    getQueryVariables,
    refetch,
    search,
  });

  const onCheckboxChange = (): void => {
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          [MyPatchesQueryParams.CommitQueue]: !getQueryVariables(search)
            .includeCommitQueue,
        },
        { arrayFormat }
      )}`
    );
  };

  const renderTable = () => {
    if (error) {
      return <ErrorWrapper>{error.message}</ErrorWrapper>;
    }
    if (showSkeleton) {
      return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
    }
    if (get(data, "userPatches.patches", []).length !== 0) {
      return data.userPatches.patches.map((p) => (
        <PatchCard key={p.id} {...p} />
      ));
    }
    return <NoResults data-cy="no-patches-found">No patches found</NoResults>;
  };

  const { limit, page, includeCommitQueue } = getQueryVariables(search);
  return (
    <PageWrapper>
      <PageTitle>My Patches</PageTitle>
      <FiltersWrapperSpaceBetween>
        <FlexRow>
          <StyledInput
            placeholder="Search Patch Descriptions"
            onChange={patchNameFilterValueOnChange}
            suffix={<Icon glyph="MagnifyingGlass" />}
            value={patchNameFilterValue}
            data-cy="patch-description-input"
            width="25%"
          />
          <StatusSelector />
        </FlexRow>
        <Checkbox
          data-cy="commit-queue-checkbox"
          onChange={onCheckboxChange}
          label="Show Commit Queue"
          checked={includeCommitQueue}
        />
      </FiltersWrapperSpaceBetween>
      <PaginationRow>
        <Pagination
          pageSize={limit}
          value={page}
          totalResults={get(data, "userPatches.filteredPatchCount", 0)}
          dataTestId="my-patches-pagination"
        />
        <PageSizeSelector
          dataTestId="my-patches-page-size-selector"
          value={limit}
        />
      </PaginationRow>
      <>{renderTable()}</>
    </PageWrapper>
  );
};

const arrayFormat = "comma";
const getQueryVariables = (search: string): UserPatchesQueryVariables => {
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
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

const FlexRow = styled.div`
  display: flex;
  flex-grow: 2;
`;
const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const FiltersWrapperSpaceBetween = styled(FiltersWrapper)`
  justify-content: space-between;
`;

const StyledSkeleton = styled(Skeleton)`
  margin-top: 12px;
`;

const NoResults = styled.div`
  margin-top: 12px;
`;
