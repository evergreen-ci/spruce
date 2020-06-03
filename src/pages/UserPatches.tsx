import React, { useState, useEffect } from "react";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import { useLocation, useHistory, useParams } from "react-router-dom";
import queryString from "query-string";
import Checkbox from "@leafygreen-ui/checkbox";
import { MyPatchesQueryParams, ALL_PATCH_STATUS } from "types/patch";
import Icon from "@leafygreen-ui/icon";
import { GET_USER_PATCHES } from "gql/queries/my-patches";
import {
  UserPatchesQueryVariables,
  UserPatchesQuery,
} from "gql/generated/types";
import { StatusSelector } from "pages/userPatches/StatusSelector";
import { useQuery } from "@apollo/react-hooks";
import { useFilterInputChangeHandler } from "hooks";
import styled from "@emotion/styled";
import get from "lodash/get";
import { Skeleton } from "antd";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { PatchCard } from "pages/userPatches/PatchCard";
import { withBannersContext } from "hoc/withBannersContext";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

const UserPatchesComponent: React.FC = () => {
  const bannersState = useBannerStateContext();
  const dispatchBanner = useBannerDispatchContext();

  const { replace } = useHistory();
  const { id: userId } = useParams<{ id: string }>();
  const { search, pathname } = useLocation();
  const [initialQueryVariables] = useState<UserPatchesQueryVariables>({
    page: 0,
    ...getQueryVariables(search, userId),
  });
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(MyPatchesQueryParams.PatchName);
  const { data, fetchMore, loading, error } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    variables: initialQueryVariables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        await fetchMore({
          variables: getQueryVariables(search, userId),
          updateQuery: (
            prev: UserPatchesQuery,
            { fetchMoreResult }: { fetchMoreResult: UserPatchesQuery }
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
  }, [search, fetchMore, userId]);

  const onCheckboxChange = (): void => {
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          [MyPatchesQueryParams.CommitQueue]: !getQueryVariables(search, userId)
            .includeCommitQueue,
        },
        { arrayFormat }
      )}`
    );
  };

  const renderTable = () => {
    if (error) {
      return (
        <PageWrapper>
          <Banners
            banners={bannersState}
            removeBanner={dispatchBanner.removeBanner}
          />
        </PageWrapper>
      );
    }
    if (loading) {
      return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
    }
    if (get(data, "userPatches.patches", []).length !== 0) {
      return data.userPatches.patches.map((p) => (
        <PatchCard key={p.id} {...p} />
      ));
    }
    return <NoResults data-cy="no-patches-found">No patches found</NoResults>;
  };

  const { limit, page, includeCommitQueue } = getQueryVariables(search, userId);
  return (
    <PageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
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
        <StyledCheckbox
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

export const UserPatches = withBannersContext(UserPatchesComponent);

const arrayFormat = "comma";
const getQueryVariables = (
  search: string,
  userId: string
): {
  includeCommitQueue: boolean;
  patchName: string;
  statuses: string[];
  limit: number;
  page: number;
  userId: string;
} => {
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
    userId,
    includeCommitQueue,
    patchName,
    statuses,
    page: getPageFromSearch(search),
    limit: getLimitFromSearch(search),
  };
};

const StyledCheckbox = styled(Checkbox)`
  margin-left: 16px;
`;

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
