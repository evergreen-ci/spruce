import { useMemo } from "react";
import styled from "@emotion/styled";
import CommitChartLabel from "components/CommitChartLabel";
import { ChartTypes, CommitVersion } from "types/commits";
import { array, string } from "utils";
import { BuildVariantCard } from "./BuildVariantCard";
import { CommitChart } from "./CommitChart";
import { ColorCount } from "./utils";

const { arrayUnion, convertArrayToObject } = array;
const { shortenGithash } = string;
interface ActiveCommitChartProps {
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
}

export const ActiveCommitChart: React.VFC<ActiveCommitChartProps> = ({
  groupedTaskStats,
  max,
  total,
  chartType,
}) => (
  <CommitChart
    groupedTaskStats={groupedTaskStats}
    total={total}
    max={max}
    chartType={chartType}
  />
);

interface ActiveCommitLabelProps {
  version: CommitVersion;
}
export const ActiveCommitLabel: React.VFC<ActiveCommitLabelProps> = ({
  version,
}) => (
  <CommitChartLabel
    versionId={version.id}
    githash={shortenGithash(version.revision)}
    createTime={version.createTime}
    author={version.author}
    message={version.message}
    upstreamProject={version.upstreamProject}
  />
);

interface BuildVariantContainerProps {
  version: CommitVersion;
}
export const BuildVariantContainer: React.VFC<BuildVariantContainerProps> = ({
  version,
}) => {
  const {
    buildVariants,
    buildVariantStats,
    projectIdentifier,
    id,
    order,
  } = version;

  const memoizedBuildVariantCards = useMemo(() => {
    const groupedBuildVariantStats = convertArrayToObject(
      buildVariantStats,
      "variant"
    );
    const groupedBuildVariants = convertArrayToObject(buildVariants, "variant");
    // Create a list of all the build variants we fetched and sort them by name
    const allBuildVariants = arrayUnion(
      Object.keys(groupedBuildVariantStats),
      Object.keys(groupedBuildVariants),
      (a, b) => a.localeCompare(b)
    );
    const buildVariantCards = allBuildVariants.map((v) => {
      const variantStats = groupedBuildVariantStats[v];
      const buildVariant = groupedBuildVariants[v];
      const { displayName, variant } = buildVariant ?? variantStats;

      return (
        <BuildVariantCard
          key={`${id}_${variant}`}
          variant={variant}
          buildVariantDisplayName={displayName}
          groupedVariantStats={variantStats}
          versionId={id}
          projectIdentifier={projectIdentifier}
          tasks={buildVariant?.tasks}
          order={order}
        />
      );
    });
    return buildVariantCards;
  }, [buildVariantStats, buildVariants, id, projectIdentifier, order]);
  return <ColumnContainer>{memoizedBuildVariantCards}</ColumnContainer>;
};

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
