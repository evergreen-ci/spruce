import styled from "@emotion/styled";
import CommitChartLabel from "components/CommitChartLabel";
import { ChartTypes, CommitVersion } from "types/commits";
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
  hasTaskFilter: boolean;
}
export const BuildVariantContainer: React.FC<BuildVariantContainerProps> = ({
  version,
  hasTaskFilter,
}) => (
  <ColumnContainer>
    {version.buildVariants.map(({ variant, displayName, tasks }) => (
      <BuildVariantCard
        versionId={version.id}
        buildVariantDisplayName={displayName}
        variant={variant}
        tasks={tasks}
        key={`${version.id}_${variant}`}
        shouldGroupTasks={!hasTaskFilter}
        projectIdentifier={version.projectIdentifier}
      />
    ))}
  </ColumnContainer>
);

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
