import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { useLocation } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import Icon from "components/Icon";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { PageWrapper, FiltersWrapper, PageTitle } from "components/styles";
import TextInputWithGlyph from "components/TextInputWithGlyph";
import { size } from "constants/tokens";
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

export const PatchesPage: React.VFC<Props> = ({
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
    resetPage: true,
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
        <TextInputWithGlyph
          icon={<Icon glyph="MagnifyingGlass" />}
          type="search"
          aria-label="patch-description-input"
          placeholder="Patch description regex"
          onChange={(e) => setAndSubmitInputValue(e.target.value)}
          value={inputValue}
          data-cy="patch-description-input"
        />
        <StatusSelector />
        <CheckboxContainer>
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
        </CheckboxContainer>
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

const PaginationRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
const FiltersWrapperSpaceBetween = styled(FiltersWrapper)`
  display: grid;
  grid-template-columns: repeat(2, 1fr) 2fr;
  grid-column-gap: ${size.s};
`;

const CheckboxContainer = styled.div`
  display: flex;
  justify-content: end;
`;
