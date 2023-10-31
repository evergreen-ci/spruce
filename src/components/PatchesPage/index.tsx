import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { SearchInput } from "@leafygreen-ui/search-input";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import PageSizeSelector, {
  usePageSizeSelector,
} from "components/PageSizeSelector";
import Pagination from "components/Pagination";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import {
  INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES,
  INCLUDE_COMMIT_QUEUE_USER_PATCHES,
  INCLUDE_HIDDEN_PATCHES,
} from "constants/cookies";
import { size } from "constants/tokens";
import { PatchesPagePatchesFragment, PatchesInput } from "gql/generated/types";
import { useFilterInputChangeHandler, usePageTitle } from "hooks";
import { useQueryParam } from "hooks/useQueryParam";
import { PatchPageQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { url } from "utils";
import { ListArea } from "./ListArea";
import { StatusSelector } from "./StatusSelector";

const { getLimitFromSearch, getPageFromSearch } = url;

interface Props {
  analyticsObject: Analytics<
    | { name: "Filter Patches"; filterBy: string }
    | { name: "Filter Commit Queue" }
    | { name: "Filter Hidden" }
    | { name: "Change Page Size" }
    | { name: "Click Patch Link" }
    | {
        name: "Click Variant Icon";
        variantIconStatus: string;
      }
  >;
  filterComp?: React.ReactNode;
  loading: boolean;
  pageTitle: string;
  pageType: "project" | "user";
  patches?: PatchesPagePatchesFragment;
}

export const PatchesPage: React.FC<Props> = ({
  analyticsObject,
  filterComp,
  loading,
  pageTitle,
  pageType,
  patches,
}) => {
  const { search } = useLocation();
  const setPageSize = usePageSizeSelector();
  const cookie =
    pageType === "project"
      ? INCLUDE_COMMIT_QUEUE_PROJECT_PATCHES
      : INCLUDE_COMMIT_QUEUE_USER_PATCHES;
  const [isCommitQueueCheckboxChecked, setIsCommitQueueCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.CommitQueue,
      Cookies.get(cookie) === "true"
    );
  const [includeHiddenCheckboxChecked, setIsIncludeHiddenCheckboxChecked] =
    useQueryParam(
      PatchPageQueryParams.Hidden,
      Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true"
    );
  const { limit, page } = usePatchesInputFromSearch(search);
  const { inputValue, setAndSubmitInputValue } = useFilterInputChangeHandler({
    urlParam: PatchPageQueryParams.PatchName,
    resetPage: true,
    sendAnalyticsEvent: (filterBy: string) =>
      analyticsObject.sendEvent({ name: "Filter Patches", filterBy }),
  });
  usePageTitle(pageTitle);

  const commitQueueCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsCommitQueueCheckboxChecked(e.target.checked);
    Cookies.set(cookie, e.target.checked ? "true" : "false");
    // eslint-disable-next-line no-unused-expressions
    analyticsObject.sendEvent({ name: "Filter Commit Queue" });
  };

  const includeHiddenCheckboxOnChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setIsIncludeHiddenCheckboxChecked(e.target.checked);
    Cookies.set(INCLUDE_HIDDEN_PATCHES, e.target.checked ? "true" : "false");
    // eslint-disable-next-line no-unused-expressions
    analyticsObject.sendEvent({ name: "Filter Hidden" });
  };

  const handlePageSizeChange = (pageSize: number): void => {
    setPageSize(pageSize);
    analyticsObject.sendEvent({ name: "Change Page Size" });
  };

  return (
    <PageWrapper>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
      <FiltersWrapperSpaceBetween hasAdditionalFilterComp={!!filterComp}>
        <SearchInput
          aria-label="Search patch descriptions"
          placeholder="Patch description regex"
          onChange={(e) => setAndSubmitInputValue(e.target.value)}
          value={inputValue}
          data-cy="patch-description-input"
        />
        <StatusSelector />
        {filterComp}
        <CheckboxContainer>
          <Checkbox
            data-cy="commit-queue-checkbox"
            onChange={commitQueueCheckboxOnChange}
            label={
              pageType === "project"
                ? "Only Show Commit Queue Patches"
                : "Include Commit Queue"
            }
            checked={isCommitQueueCheckboxChecked}
          />
          <Checkbox
            data-cy="include-hidden-checkbox"
            onChange={includeHiddenCheckboxOnChange}
            label="Include hidden"
            checked={includeHiddenCheckboxChecked}
          />
        </CheckboxContainer>
      </FiltersWrapperSpaceBetween>
      <PaginationRow>
        <Pagination
          currentPage={page}
          totalResults={patches?.filteredPatchCount ?? 0}
          pageSize={limit}
        />
        <PageSizeSelector
          data-cy="my-patches-page-size-selector"
          value={limit}
          onChange={handlePageSizeChange}
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

export const usePatchesInputFromSearch = (search: string): PatchesInput => {
  const [patchName] = useQueryParam<string>(PatchPageQueryParams.PatchName, "");
  const [rawStatuses] = useQueryParam<string[]>(
    PatchPageQueryParams.Statuses,
    []
  );
  const [hidden] = useQueryParam(PatchPageQueryParams.Hidden, false);
  const statuses = rawStatuses.filter((v) => v && v !== ALL_PATCH_STATUS);
  return {
    limit: getLimitFromSearch(search),
    includeHidden: hidden || Cookies.get(INCLUDE_HIDDEN_PATCHES) === "true",
    page: getPageFromSearch(search),
    patchName: `${patchName}`,
    statuses,
  };
};

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const FiltersWrapperSpaceBetween = styled(FiltersWrapper)<{
  hasAdditionalFilterComp: boolean;
}>`
  display: grid;
  grid-template-columns:
    repeat(
      ${({ hasAdditionalFilterComp }) => (hasAdditionalFilterComp ? 3 : 2)},
      1fr
    )
    2fr;
  grid-column-gap: ${size.s};
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: end;
  gap: ${size.xs};
`;
