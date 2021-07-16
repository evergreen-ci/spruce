import { MainlineCommitsQuery } from "gql/generated/types";
import { ChartTypes } from "types/commits";
import {
  ColumnContainer,
  FlexRowContainer,
  ProjectHealthWrapper,
} from "../CommitsWrapper";
import { InactiveCommits, InactiveCommitLine } from "../InactiveCommits/index";
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

export const WaterfallAbsolute = () => (
  <ProjectHealthWrapper>
    <FlexRowContainer>
      {versions.map((item) =>
        item.version ? (
          <ColumnContainer key={item.version.id} numCharts={versions.length}>
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
          </ColumnContainer>
        ) : (
          <ColumnContainer
            key={item.rolledUpVersions[0].id}
            numCharts={versions.length}
          >
            <InactiveCommitLine />
            <InactiveCommits rolledUpVersions={item.rolledUpVersions} />
          </ColumnContainer>
        )
      )}
    </FlexRowContainer>
    <Grid numDashedLine={5} />
  </ProjectHealthWrapper>
);

export const WaterfallPercentage = () => (
  <ProjectHealthWrapper>
    <FlexRowContainer>
      {versions.map((item) =>
        item.version ? (
          <ColumnContainer key={item.version.id} numCharts={versions.length}>
            <CommitChart
              groupedTaskStats={
                IdToTaskStatsGroupedByColor[item.version.id].stats
              }
              total={IdToTaskStatsGroupedByColor[item.version.id].total}
              max={max}
              chartType={ChartTypes.Percentage}
            />
            <CommitChartLabel
              githash={item.version.revision.substring(0, 5)}
              createTime={item.version.createTime}
              author={item.version.author}
              message={item.version.message}
            />
          </ColumnContainer>
        ) : (
          <ColumnContainer
            key={item.rolledUpVersions[0].id}
            numCharts={versions.length}
          >
            <InactiveCommitLine />
            <InactiveCommits rolledUpVersions={item.rolledUpVersions} />
          </ColumnContainer>
        )
      )}
    </FlexRowContainer>
    <Grid numDashedLine={5} />
  </ProjectHealthWrapper>
);

const versions: MainlineCommitsQuery["mainlineCommits"]["versions"] = [
  {
    version: {
      id: "spruce_987bf57eb679c6361322c3961b30a10724a9b001",
      author: "Jonathan Brill",
      createTime: new Date("2021-07-16T15:53:25Z"),
      message: "EVG-14901 add ssh key to EditSpawnHostModal (#805)",
      revision: "987bf57eb679c6361322c3961b30a10724a9b001",
      taskStatusCounts: [
        { status: "system-timed-out", count: 4 },
        { status: "system-unresponsive", count: 3 },
        { status: "setup-failed", count: 5 },
        { status: "unscheduled", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "spruce_v2.11.1_60eda8722a60ed09bb78a2ff",
      author: "Mohamed Khelif",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Triggered From Git Tag 'v2.11.1': v2.11.1",
      revision: "a77bd39ccf515b63327dc2355a8444955043c66a",
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
    version: null,
    rolledUpVersions: [
      {
        id: "spruce_a77bd39ccf515b63327dc2355a8444955043c66a",
        createTime: new Date("2021-07-13T14:51:30Z"),
        author: "Mohamed Khelif",
        order: 927,
        message: "v2.11.1",
        revision: "a77bd39ccf515b63327dc2355a8444955043c66a",
      },
    ],
  },
  {
    version: {
      id: "spruce_9c1d1ebc85829d69dde7684fbcce86dd21e5a9ad",
      author: "Mohamed Khelif",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message:
        "EVG-14799 Correctly visit configure page when no tab indicated (#810)",
      revision: "9c1d1ebc85829d69dde7684fbcce86dd21e5a9ad",
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
      id: "spruce_f7f7f1a3abdb9897dfc02b7a1de9821651b0916e",
      author: "Sophie Stadler",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Remove navigation announcement toast (#808)",
      revision: "f7f7f1a3abdb9897dfc02b7a1de9821651b0916e",
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
      id: "spruce_v2.11.0_60ec461532f4172d48288274",
      author: "Chaya Malik",
      createTime: new Date("2021-07-13T14:51:30Z"),
      message: "Triggered From Git Tag 'v2.11.0': v2.11.0",
      revision: "211b3a06e2948a5afa5dbd61c2322037c300629b",
      taskStatusCounts: [
        { status: "success", count: 6 },
        { status: "failed", count: 2 },
        { status: "dispatched", count: 4 },
        { status: "started", count: 5 },
        { status: "will-run", count: 2 },
      ],
    },
    rolledUpVersions: null,
  },
];

const IdToTaskStatsGroupedByColor = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(IdToTaskStatsGroupedByColor);
