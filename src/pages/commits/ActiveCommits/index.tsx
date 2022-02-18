import styled from "@emotion/styled";
import CommitChartLabel from "components/CommitChartLabel";
import { ChartTypes, CommitVersion } from "types/commits";
import { convertArrayToObject } from "utils/array";
import { shortenGithash } from "utils/string";
import { BuildVariantCard } from "./BuildVariantCard";
import { CommitChart } from "./CommitChart";
import { ColorCount } from "./utils";

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
  const { buildVariants, buildVariantStats } = version;
  const groupedVariants = convertArrayToObject(buildVariantStats, "variant");
  return (
    <ColumnContainer>
      {buildVariants.map(({ variant, displayName, tasks }) => (
        <BuildVariantCard
          versionId={version.id}
          buildVariantDisplayName={displayName}
          variant={variant}
          tasks={tasks}
          key={`${version.id}_${variant}`}
          projectIdentifier={version.projectIdentifier}
          groupedVariantStats={groupedVariants[variant]}
        />
      ))}
    </ColumnContainer>
  );
};

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
