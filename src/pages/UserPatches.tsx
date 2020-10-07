import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Icon from "@leafygreen-ui/icon";
import { Skeleton } from "antd";
import get from "lodash/get";
import queryString from "query-string";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { useUserPatchesAnalytics } from "analytics";
import { Banners } from "components/Banners";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import { pollInterval } from "constants/index";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  UserPatchesQueryVariables,
  UserPatchesQuery,
} from "gql/generated/types";
import { GET_USER_PATCHES } from "gql/queries/my-patches";
import { withBannersContext } from "hoc/withBannersContext";
import {
  useFilterInputChangeHandler,
  useNetworkStatus,
  usePageTitle,
  useGetUserPatchesPageTitleAndLink,
} from "hooks";
import { PatchCard } from "pages/userPatches/PatchCard";
import { StatusSelector } from "pages/userPatches/StatusSelector";
import { MyPatchesQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

const UserPatchesComponent: React.FC = () => {
  const bannersState = useBannerStateContext();
  const dispatchBanner = useBannerDispatchContext();
  const { id: userId } = useParams();
  const { replace } = useHistory();
  const { search, pathname } = useLocation();

  const queryVariables = getQueryVariables(search, userId);
  const { limit, page, includeCommitQueue } = queryVariables;
  const userPatchesAnalytics = useUserPatchesAnalytics();

  // handlers for patch description filter
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    MyPatchesQueryParams.PatchName,
    false,
    (filterBy: string) =>
      userPatchesAnalytics.sendEvent({ name: "Filter Patches", filterBy })
  );

  const { data, startPolling, stopPolling, error } = useQuery<
    UserPatchesQuery,
    UserPatchesQueryVariables
  >(GET_USER_PATCHES, {
    variables: queryVariables,
    pollInterval,
    fetchPolicy: "cache-and-network",
  });
  useNetworkStatus(startPolling, stopPolling);
  let showSkeleton = true;
  if (data) {
    showSkeleton = false;
  }
  const { title: pageTitle } = useGetUserPatchesPageTitleAndLink(userId);
  usePageTitle(pageTitle);
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
    userPatchesAnalytics.sendEvent({ name: "Filter Commit Queue" });
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
    if (showSkeleton) {
      return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
    }
    if (get(data, "userPatches.patches", []).length !== 0) {
      return data.userPatches.patches.map(({ commitQueuePosition, ...p }) => (
        <PatchCard
          key={p.id}
          {...p}
          isPatchOnCommitQueue={commitQueuePosition !== null}
        />
      ));
    }
    return <NoResults data-cy="no-patches-found">No patches found</NoResults>;
  };

  return (
    <PageWrapper>
      <Banners
        banners={bannersState}
        removeBanner={dispatchBanner.removeBanner}
      />
      <PageTitle>{pageTitle}</PageTitle>
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
          sendAnalyticsEvent={() =>
            userPatchesAnalytics.sendEvent({ name: "Change Page Size" })
          }
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
): UserPatchesQueryVariables => {
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
