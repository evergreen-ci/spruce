import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { StyledRouterLink, SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3 } from "components/Typography";
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
import { applyStrictRegex } from "utils/string";
import { GroupedTaskSquare } from "./buildVariants/GroupedTaskSquare";
import { groupTaskStatsByUmbrellaStatus } from "./buildVariants/utils";

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
        {error && <div>{error.message}</div>}{" "}
        {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
        {version?.buildVariantStats?.map(
          ({ displayName, statusCounts, variant }) => (
            <BuildVariant
              key={`buildVariant_${displayName}_${variant}`}
              data-cy="patch-build-variant"
            >
              <StyledRouterLink
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
            </BuildVariant>
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
  statusCounts,
  variant,
  versionId,
}) => {
  const orderedStatusCounts = groupTaskStatsByUmbrellaStatus(statusCounts);
  return (
    <VariantTasks>
      {Object.entries(orderedStatusCounts).map(
        ([umbrellaStatus, { statuses, count }]) => (
          <GroupedTaskSquare
            key={`${variant}_${umbrellaStatus}`}
            variant={variant}
            umbrellaStatus={umbrellaStatus}
            count={count}
            versionId={versionId}
            statuses={statuses}
          />
        )
      )}
    </VariantTasks>
  );
};

const BuildVariant = styled.div`
  margin-bottom: ${size.xs};
`;
const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
