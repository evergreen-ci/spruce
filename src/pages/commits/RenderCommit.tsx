import { ChartTypes, Commit, BuildVariantDict } from "types/commits";
import { ActiveCommitLabel, BuildVariantContainer } from "./ActiveCommits";
import { CommitBarChart } from "./ActiveCommits/CommitBarChart";
import { InactiveCommitsLine, InactiveCommitButton } from "./InactiveCommits";
import { GroupedResult } from "./types";

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
  chartType,
  commit,
  groupedResult,
  max,
}) => {
  const { rolledUpVersions, version } = commit;

  if (version) {
    return (
      <CommitBarChart
        chartType={chartType}
        total={groupedResult[version.id].total}
        groupedTaskStats={groupedResult[version.id].stats}
        eta={version.taskStatusStats?.eta}
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
  const { rolledUpVersions, version } = commit;

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
export const RenderCommitsBuildVariants: React.FC<
  RenderCommitsBuildVariantProps
> = ({ buildVariantDict, commit }) => {
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

const getCommitWidth = (commit: Commit) => {
  const { rolledUpVersions, version } = commit;
  if (version) {
    return 200;
  }
  if (rolledUpVersions) {
    return 64;
  }
  throw new Error("Commit type not found");
};

const isCommitSelected = (commit: Commit, revision: string) => {
  const { rolledUpVersions, version } = commit;

  if (!revision) {
    return false;
  }

  if (version?.revision.startsWith(revision)) {
    return true;
  }

  if (
    rolledUpVersions &&
    rolledUpVersions.some((v) => v.revision.startsWith(revision))
  ) {
    return true;
  }

  return false;
};

export {
  RenderCommitsChart,
  RenderCommitsLabel,
  getCommitKey,
  getCommitWidth,
  isCommitSelected,
};
