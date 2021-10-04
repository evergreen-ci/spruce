import { groupStatusesByUmbrellaStatus } from "./groupStatusesByUmbrellaStatus";

test("Separates statuses into groups based on umbrella status", () => {
  const tasks = [
    { status: "success", count: 6 },
    { status: "failed", count: 2 },
    { status: "dispatched", count: 4 },
    { status: "started", count: 5 },
  ];

  expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
    stats: [
      {
        count: 6,
        statuses: ["Success"],
        color: "#13AA52",
        umbrellaStatus: "success",
        statusCounts: { success: 6 },
      },
      {
        count: 2,
        statuses: ["Failed"],
        color: "#CF4A22",
        umbrellaStatus: "failed-umbrella",
        statusCounts: { failed: 2 },
      },
      {
        count: 9,
        statuses: ["Dispatched", "Running"],
        color: "#FFDD49",
        umbrellaStatus: "running-umbrella",
        statusCounts: { dispatched: 4, started: 5 },
      },
    ],
    max: 9,
    total: 17,
  });
});

test("Groups different statuses to the same color", () => {
  const tasks = [
    { status: "test-timed-out", count: 6 },
    { status: "failed", count: 2 },
    { status: "dispatched", count: 4 },
    { status: "will-run", count: 2 },
    { status: "system-timed-out", count: 5 },
    { status: "system-unresponsive", count: 2 },
  ];

  expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
    stats: [
      {
        count: 8,
        statuses: ["Test Timed Out", "Failed"],
        color: "#CF4A22",
        umbrellaStatus: "failed-umbrella",
        statusCounts: { "test-timed-out": 6, failed: 2 },
      },
      {
        count: 7,
        statuses: ["System Time Out", "System Unresponsive"],
        color: "#4f4fbf",
        umbrellaStatus: "system-failure-umbrella",
        statusCounts: { "system-timed-out": 5, "system-unresponsive": 2 },
      },
      {
        count: 4,
        statuses: ["Dispatched"],
        color: "#FFDD49",
        umbrellaStatus: "running-umbrella",
        statusCounts: { dispatched: 4 },
      },
      {
        count: 2,
        statuses: ["Will Run"],
        color: "#5D6C74",
        umbrellaStatus: "scheduled-umbrella",
        statusCounts: { "will-run": 2 },
      },
    ],
    max: 8,
    total: 21,
  });
});

test("Returns the overall maximum and total", () => {
  const tasks = [
    { status: "task-timed-out", count: 6 },
    { status: "success", count: 4 },
    { status: "started", count: 3 },
    { status: "system-failed", count: 5 },
    { status: "unscheduled", count: 2 },
    { status: "setup-failed", count: 3 },
    { status: "system-unresponsive", count: 2 },
  ];
  expect(groupStatusesByUmbrellaStatus(tasks)).toStrictEqual({
    stats: [
      {
        count: 4,
        statuses: ["Success"],
        color: "#13AA52",
        umbrellaStatus: "success",
        statusCounts: { success: 4 },
      },
      {
        count: 6,
        statuses: ["Task Timed Out"],
        color: "#CF4A22",
        umbrellaStatus: "failed-umbrella",
        statusCounts: { "task-timed-out": 6 },
      },
      {
        count: 7,
        statuses: ["System Failed", "System Unresponsive"],
        color: "#4f4fbf",
        umbrellaStatus: "system-failure-umbrella",
        statusCounts: { "system-failed": 5, "system-unresponsive": 2 },
      },
      {
        count: 3,
        statuses: ["Setup Failure"],
        color: "#f1f0fc",
        umbrellaStatus: "setup-failed",
        statusCounts: { "setup-failed": 3 },
      },
      {
        count: 3,
        statuses: ["Running"],
        color: "#FFDD49",
        umbrellaStatus: "running-umbrella",
        statusCounts: { started: 3 },
      },
      {
        count: 2,
        statuses: ["Unscheduled"],
        color: "#89979B",
        umbrellaStatus: "undispatched-umbrella",
        statusCounts: { unscheduled: 2 },
      },
    ],
    max: 7,
    total: 25,
  });
});
