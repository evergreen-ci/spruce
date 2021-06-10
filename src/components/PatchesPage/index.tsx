import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import Icon from "@leafygreen-ui/icon";
import { useLocation, useHistory } from "react-router-dom";
import { Analytics } from "analytics/addPageAction";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import {
  PageWrapper,
  StyledInput,
  FiltersWrapper,
  PageTitle,
} from "components/styles";
import {
  UserPatchesQueryVariables,
  PatchesPagePatchesFragment,
} from "gql/generated/types";
import { useFilterInputChangeHandler, usePageTitle } from "hooks";
import { MyPatchesQueryParams, ALL_PATCH_STATUS } from "types/patch";
import { queryString, url } from "utils";
import { ListArea } from "./ListArea";
import { StatusSelector } from "./StatusSelector";

const { getPageFromSearch, getLimitFromSearch } = url;
const { parseQueryString, stringifyQuery } = queryString;

interface Props {
  analyticsObject?: Analytics<
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
  error?: ApolloError;
  type: string;

}

export const PatchesPage: React.FC<Props> = ({
  analyticsObject,
  pageTitle,
  patches,
  error,
  type,
}) => {
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
      `${pathname}?${stringifyQuery({
        ...parseQueryString(search),
        [MyPatchesQueryParams.CommitQueue]: !includeCommitQueue,
      })}`
    );
    // eslint-disable-next-line no-unused-expressions
    analyticsObject?.sendEvent({ name: "Filter Commit Queue" });
  };

  return (
    <PageWrapper>
      <p>{pageTitle}</p>
      <PageTitle data-cy="patches-page-title">{pageTitle}</PageTitle>
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
          totalResults={patches?.filteredPatchCount ?? 0}
          data-cy="my-patches-pagination"
        />
        <PageSizeSelector
          data-cy="my-patches-page-size-selector"
          value={limit}
          sendAnalyticsEvent={() =>
            analyticsObject?.sendEvent({ name: "Change Page Size" })
          }
        />
      </PaginationRow>
      <ListArea
        patches={patches}
        error={error}
        type={type}
        analyticsObject={analyticsObject}
      />
    </PageWrapper>
  );
};

export const getPatchesInputFromURLSearch = (
  search: string
): UserPatchesQueryVariables["patchesInput"] => {
  const parsed = parseQueryString(search);
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
