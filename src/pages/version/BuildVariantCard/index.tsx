import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { MetadataCard, MetadataTitle } from "components/MetadataCard";
import { DEFAULT_POLL_INTERVAL } from "constants/index";
import {
  BuildVariantStatsQuery,
  BuildVariantStatsQueryVariables,
} from "gql/generated/types";
import { GET_BUILD_VARIANTS_STATS } from "gql/queries";
import { usePolling } from "hooks";
import VariantTaskGroup from "./VariantTaskGroup";

const BuildVariantCard: React.VFC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, loading, error, refetch, startPolling, stopPolling } = useQuery<
    BuildVariantStatsQuery,
    BuildVariantStatsQueryVariables
  >(GET_BUILD_VARIANTS_STATS, {
    variables: { id },
    pollInterval: DEFAULT_POLL_INTERVAL,
  });
  usePolling({ startPolling, stopPolling, refetch });
  const { version } = data || {};

  return (
    <StickyMetadataCard error={error} loading={loading}>
      <MetadataTitle>Build Variants</MetadataTitle>
      <ScrollableBuildVariantStatsContainer data-cy="build-variants">
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
      </ScrollableBuildVariantStatsContainer>
    </StickyMetadataCard>
  );
};

const StickyMetadataCard = styled(MetadataCard)`
  position: sticky;
  top: 0;
`;

const ScrollableBuildVariantStatsContainer = styled.div`
  max-height: 55vh;
  overflow-y: auto;
`;

export default BuildVariantCard;
