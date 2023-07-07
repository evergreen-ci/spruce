import { TaskStatus } from "types/task";
import {
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
} from "../constants";
import { groupedTaskStats, groupedTaskStatsAll, versions } from "../testData";
import {
  constructBuildVariantDict,
  getStatusesWithZeroCount,
  injectGlobalDimStyle,
  injectGlobalHighlightStyle,
  roundMax,
  removeGlobalDimStyle,
  removeGlobalHighlightStyle,
} from "./utils";

describe("getStatusesWithZeroCount", () => {
  it("return an array of umbrella statuses that have 0 count", () => {
    expect(getStatusesWithZeroCount(groupedTaskStats)).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
    ]);
  });
  it("should return an empty array when all umbrella statuses are present", () => {
    expect(getStatusesWithZeroCount(groupedTaskStatsAll)).toStrictEqual([]);
  });
  it("return an array of all umbrella statuses when no umbrella status exists", () => {
    expect(getStatusesWithZeroCount([])).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.Succeeded,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
      TaskStatus.SetupFailed,
    ]);
  });
});

describe("constructBuildVariantDict", () => {
  it("correctly determines priority, iconHeight, and badgeHeight", () => {
    expect(constructBuildVariantDict(versions)).toStrictEqual({
      "enterprise-macos-cxx20": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: GROUPED_BADGE_HEIGHT * 2 + GROUPED_BADGE_PADDING * 2,
        priority: 4,
      },
      "enterprise-windows-benchmarks": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: 0,
        priority: 2,
      },
      "enterprise-rhel-80-64-bit-inmem": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: 0,
        priority: 1,
      },
    });
  });
});

describe("roundMax", () => {
  it("properly rounds numbers", () => {
    expect(roundMax(8)).toBe(10); // 0 <= x < 100
    expect(roundMax(147)).toBe(150); // 100 <= x < 500
    expect(roundMax(712)).toBe(800); // 500 <= x < 1000
    expect(roundMax(1320)).toBe(1500); // 1000 <= x < 5000
    expect(roundMax(6430)).toBe(7000); // 5000 <= x
  });
});

describe("injectGlobalStyle", () => {
  it("should properly inject global style using the task identifier", () => {
    const dimIconStyle = "dim-icon-style";
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      dimIconStyle
    );

    injectGlobalDimStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      dimIconStyle
    );
  });
});

describe("removeGlobalDimStyle", () => {
  it("should properly remove global style", () => {
    const dimIconStyle = "dim-icon-style";

    // Styles should persist from previous test.
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      dimIconStyle
    );

    removeGlobalDimStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      dimIconStyle
    );
  });
});

describe("injectGlobalHighlightStyle", () => {
  it("should properly inject global style using the task identifier", () => {
    const taskIconStyle = "task-icon-style";
    const taskIdentifier = "ubuntu1604-test_util";
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIconStyle
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIdentifier
    );

    injectGlobalHighlightStyle("ubuntu1604-test_util");
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIconStyle
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIdentifier
    );
  });
});

describe("removeGlobalHighlightStyle", () => {
  it("should properly remove global style", () => {
    const taskIconStyle = "task-icon-style";
    const taskIdentifier = "ubuntu1604-test_util";

    // Styles should persist from previous test.
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIconStyle
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).toContain(
      taskIdentifier
    );

    removeGlobalHighlightStyle();
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIconStyle
    );
    expect(document.getElementsByTagName("head")[0].innerHTML).not.toContain(
      taskIdentifier
    );
  });
});
