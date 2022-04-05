import { ChartTypes, Commit, BuildVariantDict } from "types/commits";
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
}
const RenderCommitsLabel: React.FC<RenderCommitsLabelProps> = ({
  commit,
  hasFilters,
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
      />
    );
  }
  return null;
};

interface RenderCommitsBuildVariantProps {
  commit: Commit;
  buildVariantDict: BuildVariantDict;
}
export const RenderCommitsBuildVariants: React.FC<RenderCommitsBuildVariantProps> = ({
  commit,
  buildVariantDict,
}) => {
  const { version } = commit;

  if (version) {
    return (
      <BuildVariantContainer
        version={version}
        buildVariantDict={buildVariantDict}
      />
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
