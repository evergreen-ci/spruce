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
import { GET_USER_PATCHES } from "gql/queries/my-patches";
import {
  UserPatchesQueryVariables,
  UserPatchesQuery,
} from "gql/generated/types";
import { StatusSelector } from "pages/my-patches/StatusSelector";
import { useQuery } from "@apollo/react-hooks";
import { useFilterInputChangeHandler, usePrevious } from "hooks";
import styled from "@emotion/styled";
import get from "lodash/get";
import { Skeleton, Pagination } from "antd";
import { Banners } from "components/Banners";
import {
  useBannerDispatchContext,
  useBannerStateContext,
} from "context/banners";
import { PatchCard } from "pages/my-patches/PatchCard";
import { withBannersContext } from "hoc/withBannersContext";

const MyPatchesComponent: React.FC = () => {
  const bannersState = useBannerStateContext();
  const dispatchBanner = useBannerDispatchContext();

  const { replace } = useHistory();
  const { search, pathname } = useLocation();
  const [page, setPage] = useState(1);
  const [initialQueryVariables] = useState<UserPatchesQueryVariables>({
    page: 0,
    ...getQueryVariables(search),
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
  }, [page, search, prevSearch, fetchMore]);

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

  const onChange = (pageNum: number) => {
    setPage(pageNum);
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
          checked={getQueryVariables(search).includeCommitQueue}
        />
      </FiltersWrapperSpaceBetween>
      <Pagination
        onChange={onChange}
        current={page}
        pageSize={LIMIT}
        total={get(data, "userPatches.filteredPatchCount", 0)}
      />
      <>{renderTable()}</>
    </PageWrapper>
  );
};

export const MyPatches = withBannersContext(MyPatchesComponent);

const arrayFormat = "comma";
const LIMIT = 7;
const getQueryVariables = (
  search: string
): {
  includeCommitQueue: boolean;
  patchName: string;
  statuses: string[];
  limit: number;
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
    includeCommitQueue,
    patchName,
    statuses,
    limit: LIMIT,
  };
};

const StyledCheckbox = styled(Checkbox)`
  margin-left: 16px;
`;

const FlexRow = styled.div`
  display: flex;
  flex-grow: 2;
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
