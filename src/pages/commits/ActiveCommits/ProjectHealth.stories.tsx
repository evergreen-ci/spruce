import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import {
  ActiveCommitWrapper,
  FlexRowContainer,
  ProjectHealthWrapper,
} from "../CommitsWrapper";
import { CommitChart } from "./CommitChart";
import { CommitChartLabel } from "./CommitChartLabel";
import { Grid } from "./Grid";
import {
  getAllTaskStatsGroupedByColor,
  findMaxGroupedTaskStats,
} from "./utils";

export default {
  title: "Project Health Page",
};

export const ActiveCommits = () => (
  <ProjectHealthWrapper>
    <FlexRowContainer>
      {versions.map((item) =>
        item.version ? (
          <ActiveCommitWrapper key={item.version.id}>
            <CommitChart
              groupedTaskStats={
                IdToTaskStatsGroupedByColor[item.version.id].stats
              }
              total={IdToTaskStatsGroupedByColor[item.version.id].total}
              max={max}
              chartType={ChartTypes.Absolute}
            />
            <CommitChartLabel
              githash={item.version.revision.substring(0, 5)}
              createTime={item.version.createTime}
              author={item.version.author}
              message={item.version.message}
            />
          </ActiveCommitWrapper>
        ) : null
      )}
    </FlexRowContainer>
    <Grid numDashedLine={5} />
  </ProjectHealthWrapper>
);

const versions: MainlineCommitsQuery["mainlineCommits"]["versions"] = [
  {
    version: {
      id: "123",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton Internal DocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      taskStatusCounts: [
        { status: "success", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "started", count: 5 },
        { status: "will-run", count: 2 },
        { status: "setup-failed", count: 4 },
        { status: "system-failed", count: 6 },
        { status: "blocked", count: 6 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "12",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      taskStatusCounts: [
        { status: "blocked", count: 4 },
        { status: "aborted", count: 3 },
        { status: "undispatched", count: 5 },
        { status: "test-timed-out", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "13",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton Internal DocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Mohamed Khelif",
      taskStatusCounts: [
        { status: "success", count: 4 },
        { status: "inactive", count: 3 },
        { status: "pending", count: 5 },
        { status: "aborted", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "14",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Arjun Patel",
      taskStatusCounts: [
        { status: "blocked", count: 4 },
        { status: "aborted", count: 3 },
        { status: "undispatched", count: 5 },
        { status: "test-timed-out", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "15",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton Internal DocumentSourceDensify",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Elena Chen",
      taskStatusCounts: [
        { status: "setup-failed", count: 4 },
        { status: "inactive", count: 3 },
        { status: "pending", count: 5 },
        { status: "unstarted", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "16",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      taskStatusCounts: [
        { status: "system-failed", count: 6 },
        { status: "pending", count: 2 },
        { status: "known-issue", count: 4 },
        { status: "unscheduled", count: 12 },
        { status: "task-timed-out", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "17",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      author: "Sophie Stadler",
      taskStatusCounts: [
        { status: "system-timed-out", count: 4 },
        { status: "system-unresponsive", count: 3 },
        { status: "setup-failed", count: 5 },
        { status: "unscheduled", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];

const IdToTaskStatsGroupedByColor = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(IdToTaskStatsGroupedByColor);
