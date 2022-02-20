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

export const ActiveCommitChart: React.FC<ActiveCommitChartProps> = ({
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
export const ActiveCommitLabel: React.FC<ActiveCommitLabelProps> = ({
  version,
}) => (
  <CommitChartLabel
    versionId={version.id}
    githash={shortenGithash(version.revision)}
    createTime={version.createTime}
    author={version.author}
    message={version.message}
  />
);

interface BuildVariantContainerProps {
  version: CommitVersion;
}
export const BuildVariantContainer: React.FC<BuildVariantContainerProps> = ({
  version,
}) => {
  const { buildVariants, buildVariantStats, projectIdentifier, id } = version;

  const memoizedBuildVariantCards = useMemo(() => {
    const groupedVariantStats = convertArrayToObject(
      buildVariantStats,
      "variant"
    );
    const groupedBuildVariants = convertArrayToObject(buildVariants, "variant");
    // Create a list of all the build variants we fetched and sort them by name
    const allBuildVariants = arrayUnion(
      Object.keys(groupedVariantStats),
      Object.keys(groupedBuildVariants),
      (a, b) => a.localeCompare(b)
    );
    const buildVariantCards = allBuildVariants.map((variant) => {
      const variantStats = groupedVariantStats[variant];
      const buildVariant = groupedBuildVariants[variant];
      const displayName = buildVariant
        ? buildVariant.displayName
        : variantStats.displayName;
      const variantString = buildVariant
        ? buildVariant.variant
        : variantStats.variant;
      return (
        <BuildVariantCard
          key={`${id}_${variant}`}
          variant={variantString}
          buildVariantDisplayName={displayName}
          groupedVariantStats={variantStats}
          versionId={id}
          projectIdentifier={projectIdentifier}
          tasks={buildVariant?.tasks}
        />
      );
    });
    return buildVariantCards;
  }, [buildVariantStats, buildVariants, id, projectIdentifier]);
  return <ColumnContainer>{memoizedBuildVariantCards}</ColumnContainer>;
};

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
