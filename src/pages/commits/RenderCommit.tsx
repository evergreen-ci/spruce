import { ChartTypes, Commit } from "types/commits";
import {
  ActiveCommitChart,
  ActiveCommitLabel,
  BuildVariantContainer,
} from "./ActiveCommits";
import { GroupedResult } from "./ActiveCommits/utils";
import { InactiveCommitsLine, InactiveCommitButton } from "./InactiveCommits";

type ActiveCommitProps = {
  groupedResult: { [key: string]: GroupedResult };
  max: number;
  chartType: ChartTypes;
  hasTaskFilter: boolean;
};

type RenderCommitsChartProps = ActiveCommitProps & {
  commit: Commit;
};

const RenderCommitsChart: React.FC<RenderCommitsChartProps> = ({
  commit,
  chartType,
  groupedResult,
  max,
}) => {
  const { version, rolledUpVersions } = commit;

  if (version) {
    return (
      <ActiveCommitChart
        chartType={chartType}
        total={groupedResult[version.id].total}
        groupedTaskStats={groupedResult[version.id].stats}
        max={max}
      />
    );
  }
  if (rolledUpVersions) {
    return <InactiveCommitsLine />;
  }
  return null;
};

interface RenderCommitsLabelProps {
  commit: Commit;
  hasFilters: boolean;
  isScrolled: boolean;
}
const RenderCommitsLabel: React.FC<RenderCommitsLabelProps> = ({
  commit,
  hasFilters,
  isScrolled,
}) => {
  const { version, rolledUpVersions } = commit;

  if (version) {
    return <ActiveCommitLabel version={version} />;
  }
  if (rolledUpVersions) {
    return (
      <InactiveCommitButton
        rolledUpVersions={rolledUpVersions}
        hasFilters={hasFilters}
        isScrolled={isScrolled}
      />
    );
  }
  return null;
};

interface RenderCommitsBuildVariantProps {
  commit: Commit;
  hasTaskFilter: boolean;
}
export const RenderCommitsBuildVariants: React.FC<RenderCommitsBuildVariantProps> = ({
  commit,
  hasTaskFilter,
}) => {
  const { version } = commit;

  if (version) {
    return (
      <BuildVariantContainer version={version} hasTaskFilter={hasTaskFilter} />
    );
  }

  return null;
};

const getCommitKey = (commit: Commit) => {
  if (commit.version) {
    return commit.version.id;
  }
  if (commit.rolledUpVersions) {
    return commit.rolledUpVersions[0].id;
  }
  return "";
};

export { RenderCommitsChart, RenderCommitsLabel, getCommitKey };
