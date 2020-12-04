import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Icon from "@leafygreen-ui/icon";
import { Skeleton } from "antd";
import queryString from "query-string";
import { useLocation, useHistory } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import { Banners } from "components/Banners";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import {
  UserPatchesQueryVariables,
  UserPatchesQuery,
} from "gql/generated/types";
import { withBannersContext } from "hoc/withBannersContext";
import { useFilterInputChangeHandler, usePageTitle } from "hooks";
import { PatchCard } from "pages/userPatches/PatchCard";
import { StatusSelector } from "pages/userPatches/StatusSelector";
import { MyPatchesQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { getPageFromSearch, getLimitFromSearch } from "utils/url";

interface Props {
  analyticsObject?: Analytics<
    | { name: "Filter Patches"; filterBy: string }
    | { name: "Filter Commit Queue" }
    | { name: "Change Page Size" }
  >;
  pageTitle: string;
  patches?: UserPatchesQuery["user"]["patches"];
  error?: ApolloError;
}

const PatchesListCore: React.FC<Props> = ({
  analyticsObject,
  pageTitle,
  patches,
  error,
}) => {
  const bannersState = useBannerStateContext();
  const dispatchBanner = useBannerDispatchContext();
  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const { limit, page, includeCommitQueue } = getPatchesInputFromURLSearch(
    search
  );
  const [
    patchNameFilterValue,
    patchNameFilterValueOnChange,
  ] = useFilterInputChangeHandler(
    MyPatchesQueryParams.PatchName,
    false,
    (filterBy: string) =>
      analyticsObject?.sendEvent({ name: "Filter Patches", filterBy })
  );
  usePageTitle(pageTitle);
  const onCheckboxChange = (): void => {
    replace(
      `${pathname}?${queryString.stringify(
        {
          ...queryString.parse(search, { arrayFormat }),
          [MyPatchesQueryParams.CommitQueue]: !includeCommitQueue,
        },
        { arrayFormat }
      )}`
    );
    // eslint-disable-next-line no-unused-expressions
    analyticsObject?.sendEvent({ name: "Filter Commit Queue" });
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
          totalResults={patches?.filteredPatchCount ?? 0}
          dataTestId="my-patches-pagination"
        />
        <PageSizeSelector
          dataTestId="my-patches-page-size-selector"
          value={limit}
          sendAnalyticsEvent={() =>
            analyticsObject?.sendEvent({ name: "Change Page Size" })
          }
        />
      </PaginationRow>
      <ListArea patches={patches} error={error} />
    </PageWrapper>
  );
};

const ListArea: React.FC<{
  patches?: UserPatchesQuery["user"]["patches"];
  error?: ApolloError;
}> = ({ patches, error }) => {
  const bannersState = useBannerStateContext();
  const dispatchBanner = useBannerDispatchContext();
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
  if (!patches) {
    return <StyledSkeleton active title={false} paragraph={{ rows: 4 }} />;
  }
  if (patches?.patches.length !== 0) {
    return (
      <>
        {patches?.patches.map(({ commitQueuePosition, ...p }) => (
          <PatchCard
            key={p.id}
            {...p}
            isPatchOnCommitQueue={commitQueuePosition !== null}
          />
        ))}
      </>
    );
  }
  return <NoResults data-cy="no-patches-found">No patches found</NoResults>;
};

export const PatchesList = withBannersContext(PatchesListCore);

const arrayFormat = "comma";
export const getPatchesInputFromURLSearch = (
  search: string
): UserPatchesQueryVariables["patchesInput"] => {
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
