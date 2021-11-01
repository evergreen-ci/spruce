import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Icon from "@leafygreen-ui/icon";
import { useLocation } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import {
  PageWrapper,
  FiltersWrapper,
  PageTitle,
  StyledInput,
} from "components/styles";
import { PatchesPagePatchesFragment, PatchesInput } from "gql/generated/types";
import {
  useFilterInputChangeHandler,
  usePageTitle,
  useUpdateURLQueryParams,
} from "hooks";
import { PatchPageQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { queryString, url } from "utils";
import { ListArea } from "./ListArea";
import { StatusSelector } from "./StatusSelector";

const { getPageFromSearch, getLimitFromSearch } = url;
const { parseQueryString } = queryString;

interface Props {
  analyticsObject: Analytics<
    | { name: "Filter Patches"; filterBy: string }
    | { name: "Filter Commit Queue" }
    | { name: "Change Page Size" }
    | { name: "Click Patch Link" }
    | {
        name: "Click Variant Icon";
        variantIconStatus: string;
      }
  >;
  pageTitle: string;
  patches?: PatchesPagePatchesFragment;
  loading: boolean;
  pageType: "project" | "user";
}

export const PatchesPage: React.FC<Props> = ({
  analyticsObject,
  pageTitle,
  patches,
  loading,
  pageType,
}) => {
  const { search } = useLocation();
  const parsed = parseQueryString(search);
  const isCommitQueueCheckboxChecked =
    parsed[PatchPageQueryParams.CommitQueue] === "true";
  const { limit, page } = getPatchesInputFromURLSearch(search);
  const { inputValue, setAndSubmitInputValue } = useFilterInputChangeHandler({
    urlParam: PatchPageQueryParams.PatchName,
    resetPage: false,
    sendAnalyticsEvent: (filterBy: string) =>
      analyticsObject.sendEvent({ name: "Filter Patches", filterBy }),
  });
  const updateQueryParams = useUpdateURLQueryParams();
  usePageTitle(pageTitle);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    updateQueryParams({
      [PatchPageQueryParams.CommitQueue]: `${e.target.checked}`,
    });
    // eslint-disable-next-line no-unused-expressions
    analyticsObject.sendEvent({ name: "Filter Commit Queue" });
  };

  return (
    <PageWrapper>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapperSpaceBetween>
        <FlexRow>
          <StyledInput
            placeholder="Search Patch Descriptions"
            onChange={(e) => setAndSubmitInputValue(e.target.value)}
            suffix={<Icon glyph="MagnifyingGlass" />}
            value={inputValue}
            data-cy="patch-description-input"
            width="25%"
          />
          <StatusSelector />
        </FlexRow>
        <Checkbox
          data-cy="commit-queue-checkbox"
          onChange={onCheckboxChange}
          label={
            pageType === "project"
              ? "Only Show Commit Queue Patches"
              : "Include Commit Queue"
          }
          checked={isCommitQueueCheckboxChecked}
        />
      </FiltersWrapperSpaceBetween>
      <PaginationRow>
        <Pagination
          pageSize={limit}
          value={page}
          totalResults={patches?.filteredPatchCount ?? 0}
          data-cy="my-patches-pagination"
        />
        <PageSizeSelector
          data-cy="my-patches-page-size-selector"
          value={limit}
          sendAnalyticsEvent={() =>
            analyticsObject.sendEvent({ name: "Change Page Size" })
          }
        />
      </PaginationRow>
      <ListArea
        patches={patches}
        loading={loading}
        pageType={pageType}
        analyticsObject={analyticsObject}
      />
    </PageWrapper>
  );
};

export const getPatchesInputFromURLSearch = (search: string): PatchesInput => {
  const parsed = parseQueryString(search);
  const patchName = (parsed[PatchPageQueryParams.PatchName] || "").toString();
  const rawStatuses = parsed[PatchPageQueryParams.Statuses];
  const statuses = (Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses]
  ).filter((v) => v && v !== ALL_PATCH_STATUS);
  return {
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
