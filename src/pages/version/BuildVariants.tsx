import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
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
import { useNetworkStatus } from "hooks";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import { applyStrictRegex } from "utils/string";

export const BuildVariants: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(id);

  const { data, loading, error, startPolling, stopPolling } = useQuery<
    GetBuildVariantStatsQuery,
    GetBuildVariantStatsQueryVariables
  >(GET_BUILD_VARIANTS_STATS, {
    variables: { id },
    pollInterval,
  });
  useNetworkStatus(startPolling, stopPolling);
  const { version } = data || {};

  return (
    <>
      {/* @ts-expect-error */}
      <SiderCard>
        <H3>Build Variants</H3>
        <Divider />
        {error && <div>{error.message}</div>}
        {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
        {version?.buildVariantStats?.map(
          ({ displayName, statusCounts, variant }) => (
            <div
              key={`buildVariant_${displayName}_${variant}`}
              data-cy="patch-build-variant"
            >
              <StyledRouterLink
                css={wordBreakCss}
                to={`${getVersionRoute(id, {
                  page: 0,
                  variant: applyStrictRegex(variant),
                })}`}
                onClick={() =>
                  sendEvent({
                    name: "Click Build Variant Grid Link",
                  })
                }
              >
                {displayName}
              </StyledRouterLink>
              <VariantTaskGroup
                variant={variant}
                statusCounts={statusCounts}
                versionId={id}
              />
            </div>
          )
        )}
      </SiderCard>
    </>
  );
};

interface VariantTaskGroupProps {
  variant: string;
  statusCounts: StatusCount[];
  versionId: string;
}
const VariantTaskGroup: React.FC<VariantTaskGroupProps> = ({
  variant,
  statusCounts,
  versionId,
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);
  const { sendEvent } = useVersionAnalytics(versionId);

  return (
    <VariantTasks>
      {stats.map(
        ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
          <>
            <GroupedTaskStatusBadge
              variant={variant}
              versionId={versionId}
              status={umbrellaStatus}
              count={count}
              onClick={() =>
                sendEvent({
                  name: "Click Grouped Task Square",
                  taskSquareStatuses: Object.keys(groupedStatusCounts),
                })
              }
              statusCounts={groupedStatusCounts}
            />
          </>
        )
      )}
    </VariantTasks>
  );
};

const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${size.xs};
  > * {
    margin-right: ${size.xs};
    margin-bottom: ${size.xs};
  }
`;
