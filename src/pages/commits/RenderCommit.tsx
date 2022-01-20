import React from "react";
import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import { ActiveCommit } from "./ActiveCommits";
import { GroupedResult } from "./ActiveCommits/utils";
import InactiveCommits from "./InactiveCommits";

type Commits = MainlineCommitsQuery["mainlineCommits"]["versions"];
type Commit = Commits[0];

type ActiveCommitProps = {
  groupedResult: { [key: string]: GroupedResult };
  max: number;
  chartType: ChartTypes;
  hasTaskFilter: boolean;
};

// type InactiveCommitProps = React.ComponentProps<typeof InactiveCommits>;
type RenderCommitsChartProps = ActiveCommitProps & {
  hasFilter: boolean;
  commit: Commit;
};

const RenderCommitsChart: React.FC<RenderCommitsChartProps> = ({
  commit,
  chartType,
  groupedResult,
  hasFilter,
  hasTaskFilter,
  max,
}) => {
  const { version, rolledUpVersions } = commit;

  if (version) {
    return (
      <ActiveCommit
        version={version}
        chartType={chartType}
        total={groupedResult[version.id].total}
        groupedTaskStats={groupedResult[version.id].stats}
        hasTaskFilter={hasTaskFilter}
        max={max}
      />
    );
  }
  if (rolledUpVersions) {
    return (
      <InactiveCommits
        rolledUpVersions={rolledUpVersions}
        hasFilters={hasFilter}
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
export { RenderCommitsChart, getCommitKey };
