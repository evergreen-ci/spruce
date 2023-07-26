import {
  findMaxGroupedTaskStats,
  getAllTaskStatsGroupedByColor,
} from "pages/commits/utils";
import { render, screen, userEvent, waitFor } from "test_utils";
import { ChartTypes } from "types/commits";
import { CommitBarChart } from ".";

describe("commitChart", () => {
  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it("display right amount of bars", () => {
    render(
      <CommitBarChart
        key={versions[0].version.id}
        groupedTaskStats={groupedTaskData[versions[0].version.id].stats}
        total={groupedTaskData[versions[0].version.id].total}
        max={max}
        chartType={ChartTypes.Absolute}
      />
    );
    expect(screen.queryAllByDataCy("commit-chart-bar")).toHaveLength(4);
  });

  it("hovering over the chart should open a tooltip", async () => {
    render(
      <CommitBarChart
        key={versions[0].version.id}
        groupedTaskStats={groupedTaskData[versions[0].version.id].stats}
        total={groupedTaskData[versions[0].version.id].total}
        max={max}
        chartType={ChartTypes.Absolute}
      />
    );

    expect(screen.queryByDataCy("commit-chart-tooltip")).toBeNull();
    userEvent.hover(screen.queryByDataCy("commit-chart-container"));
    await waitFor(() => {
      expect(screen.getByDataCy("commit-chart-tooltip")).toBeInTheDocument();
    });
  });

  it("should show all umbrella statuses (normal and dimmed) and their counts", async () => {
    render(
      <CommitBarChart
        key={versions[0].version.id}
        groupedTaskStats={groupedTaskData[versions[0].version.id].stats}
        total={groupedTaskData[versions[0].version.id].total}
        max={max}
        chartType={ChartTypes.Absolute}
      />
    );

    expect(screen.queryByDataCy("commit-chart-tooltip")).toBeNull();
    userEvent.hover(screen.queryByDataCy("commit-chart-container"));
    await waitFor(() => {
      expect(screen.getByDataCy("commit-chart-tooltip")).toBeInTheDocument();
    });
    expect(screen.queryAllByDataCy("current-status-count")).toHaveLength(4);
    expect(screen.queryByDataCy("commit-chart-tooltip")).toHaveTextContent("6");
    expect(screen.queryByDataCy("commit-chart-tooltip")).toHaveTextContent("2");
    expect(screen.queryByDataCy("commit-chart-tooltip")).toHaveTextContent("9");
    expect(screen.queryByDataCy("commit-chart-tooltip")).toHaveTextContent("0");
  });
});

const versions = [
  {
    rolledUpVersions: null,
    version: {
      author: "Mohamed Khelif",
      createTime: new Date("2021-06-16T23:38:13Z"),
      id: "123",
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 123,
      projectIdentifier: "mongodb-mongo-master",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusStats: {
        counts: [
          { count: 6, status: "success" },
          { count: 2, status: "failed" },
          { count: 4, status: "dispatched" },
          { count: 5, status: "started" },
          { count: 2, status: "will-run" },
        ],
        eta: null,
      },
    },
  },
];

const groupedTaskData = getAllTaskStatsGroupedByColor(versions);
const { max } = findMaxGroupedTaskStats(groupedTaskData);
