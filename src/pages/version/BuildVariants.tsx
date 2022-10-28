import { useQuery } from "@apollo/client";
import { useParams, useLocation } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { MetadataCard, MetadataTitle } from "components/MetadataCard";
import { StyledRouterLink, wordBreakCss } from "components/styles";
import { VariantGroupedTaskStatusBadges } from "components/VariantGroupedTaskStatusBadges";
import { pollInterval } from "constants/index";
import { getVersionRoute } from "constants/routes";
import {
  GetBuildVariantStatsQuery,
  GetBuildVariantStatsQueryVariables,
  StatusCount,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_STATS } from "gql/queries";
import { usePolling } from "hooks";
import { queryString, string } from "utils";

const { parseQueryString } = queryString;
const { applyStrictRegex } = string;

export const BuildVariants: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();
  const { sorts } = parseQueryString(search);
  const { sendEvent } = useVersionAnalytics(id);

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
    <MetadataCard error={error} loading={loading}>
      <MetadataTitle>Build Variants</MetadataTitle>
      {version?.buildVariantStats?.map(
        ({ displayName, statusCounts, variant }) => (
          <div
            key={`buildVariant_${displayName}_${variant}`}
            data-cy="patch-build-variant"
          >
            <StyledRouterLink
              css={wordBreakCss}
              to={getVersionRoute(id, {
                sorts,
                page: 0,
                variant: applyStrictRegex(variant),
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
            <VariantTaskGroup
              variant={variant}
              statusCounts={statusCounts}
              versionId={id}
            />
          </div>
        )
      )}
    </MetadataCard>
  );
};

interface VariantTaskGroupProps {
  variant: string;
  statusCounts: StatusCount[];
  versionId: string;
}
const VariantTaskGroup: React.VFC<VariantTaskGroupProps> = ({
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
      preserveSorts
    />
  );
};
