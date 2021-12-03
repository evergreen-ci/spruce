import { sortTasks } from "./sort";

describe("sortTasks", () => {
  it("correctly sorts task statuses", () => {
    const initialSort = [
      "aborted",
      "blocked",
      "dispatched",
      "failed",
      "inactive",
      "known-failure",
      "pending",
      "setup-failed",
      "started",
      "success",
      "system-failed",
      "system-timed-out",
      "system-unresponsive",
      "task-timed-out",
      "test-timed-out",
      "undispatched",
      "unstarted",
    ];

    const expected = [
      "failed",
      "task-timed-out",
      "test-timed-out",
      "setup-failed",
      "system-failed",
      "system-timed-out",
      "system-unresponsive",
      "dispatched",
      "started",
      "aborted",
      "blocked",
      "inactive",
      "known-failure",
      "pending",
      "undispatched",
      "unstarted",
      "success",
    ];

    expect(initialSort.sort(sortTasks)).toStrictEqual(expected);
  });
});
