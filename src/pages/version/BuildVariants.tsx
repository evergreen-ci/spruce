import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { StyledRouterLink, SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3, wordBreakCss } from "components/Typography";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import {
  GetBuildVariantStatsQuery,
  GetBuildVariantStatsQueryVariables,
  StatusCount,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_STATS } from "gql/queries";
import { usePolling } from "hooks";
import { queryString, string, statuses } from "utils";

const { groupStatusesByUmbrellaStatus } = statuses;
const { parseQueryString } = queryString;
const { applyStrictRegex } = string;

export const BuildVariants: React.VFC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    GetBuildVariantStatsQuery,
    GetBuildVariantStatsQueryVariables
  >(GET_BUILD_VARIANTS_STATS, {
    variables: { id },
    pollInterval,
  });
  usePolling(startPolling, stopPolling, refetch);
  const { version } = data || {};

  return (
    <>
      {/* @ts-expect-error */}
      <SiderCard>
        <H3>Build Variants</H3>
        <Divider />
        {error && <div>{error.message}</div>}
        {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
        <div data-cy="build-variants">
          {version?.buildVariantStats?.map(
            ({ displayName, statusCounts, variant }) => (
              <VariantTaskGroup
                key={`buildVariant_${displayName}_${variant}`}
                displayName={displayName}
                statusCounts={statusCounts}
                variant={variant}
                versionId={id}
              />
            )
          )}
        </div>
      </SiderCard>
    </>
  );
};

interface VariantTaskGroupProps {
  displayName: string;
  statusCounts: StatusCount[];
  variant: string;
  versionId: string;
  isDownstream?: boolean;
}
const VariantTaskGroup: React.VFC<VariantTaskGroupProps> = ({
  displayName,
  statusCounts,
  variant,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);
  const { search } = useLocation();
  const queryParams = parseQueryString(search);

  const versionRouteParams = {
    sorts: queryParams.sorts,
    page: 0,
    variant: applyStrictRegex(variant),
  };

  const callBack = (taskSquareStatuses: string[]) => () => {
    sendEvent({
      name: "Click Grouped Task Square",
      taskSquareStatuses,
    });
  };

  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  return (
    <div data-cy="patch-build-variant">
      <StyledRouterLink
        css={wordBreakCss}
        to={getVersionRoute(versionId, {
          ...versionRouteParams,
        })}
        onClick={() =>
          sendEvent({
            name: "Click Build Variant Grid Link",
          })
        }
        data-cy="build-variant-display-name"
      >
        {displayName}
      </StyledRouterLink>

      <TaskBadgeContainer>
        {stats.map(
          ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
            <GroupedTaskStatusBadge
              key={`${versionId}_${variant}_${umbrellaStatus}`}
              count={count}
              onClick={callBack(Object.keys(groupedStatusCounts))}
              queryParamsToPreserve={versionRouteParams}
              status={umbrellaStatus}
              statusCounts={groupedStatusCounts}
              versionId={versionId}
            />
          )
        )}
      </TaskBadgeContainer>
    </div>
  );
};

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: ${size.xs};
  margin-bottom: ${size.xs};
  > * {
    margin-right: ${size.xs};
  }
`;
