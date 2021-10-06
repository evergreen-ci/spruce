import { TaskStatus } from "types/task";
import { groupTasksByUmbrellaStatus } from "./utils";

describe("groupTasksByUmbrellaStatus", () => {
  test("Seperates tasks into groups based on the color of the status", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];

    expect(groupTasksByUmbrellaStatus(tasks)).toStrictEqual({
      "failed-umbrella": {
        count: 1,
        statuses: ["failed"],
      },
      success: {
        count: 1,
        statuses: ["success"],
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
      },
    });
  });
  test("Groups tasks with different statuses but the same color", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        execution: 0,
        displayName: "some-failed-task",
        status: TaskStatus.TaskTimedOut,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];

    expect(groupTasksByUmbrellaStatus(tasks)).toStrictEqual({
      "failed-umbrella": {
        count: 2,
        statuses: ["failed", "task-timed-out"],
      },
      success: {
        count: 1,
        statuses: ["success"],
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
      },
    });
  });
  test("Keeps an accurate count of tasks with the same status and doesnt duplicate statuses", () => {
    const tasks = [
      {
        id: "123",
        execution: 0,
        displayName: "some-task",
        status: TaskStatus.Failed,
      },
      {
        id: "1996",
        execution: 0,
        displayName: "some-failed-task",
        status: TaskStatus.Failed,
      },
      {
        id: "234",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Succeeded,
      },
      {
        id: "2020",
        execution: 0,
        displayName: "some-other-task",
        status: TaskStatus.Started,
      },
    ];

    expect(groupTasksByUmbrellaStatus(tasks)).toStrictEqual({
      "failed-umbrella": {
        count: 2,
        statuses: ["failed"],
      },
      success: {
        count: 1,
        statuses: ["success"],
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
      },
    });
  });
});
