import { useQuery } from "@apollo/client";
import { Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { StyledRouterLink, SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";
import { H3, wordBreakCss } from "components/Typography";
import { VariantGroupedTaskStatusBadges } from "components/VariantGroupedTaskStatusBadges";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  GetBuildVariantStatsQuery,
  GetBuildVariantStatsQueryVariables,
  StatusCount,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_STATS } from "gql/queries";
import { useNetworkStatus } from "hooks";
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
  const { sendEvent } = useVersionAnalytics(versionId);

  const callBack = (statuses: string[]) => () => {
    sendEvent({
      name: "Click Grouped Task Square",
      taskSquareStatuses: statuses,
    });
  };
  return (
    <VariantGroupedTaskStatusBadges
      variant={variant}
      statusCounts={statusCounts}
      versionId={versionId}
      onClick={callBack}
    />
  );
};
