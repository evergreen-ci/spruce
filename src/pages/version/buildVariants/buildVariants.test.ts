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
        textColor: "#8F221B",
        fill: "#FCEBE2",
      },
      success: {
        count: 1,
        statuses: ["success"],
        textColor: "#116149",
        fill: "#E4F4E4",
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
        textColor: "#86681D",
        fill: "#FEF7E3",
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
        textColor: "#8F221B",
        fill: "#FCEBE2",
      },
      success: {
        count: 1,
        statuses: ["success"],
        textColor: "#116149",
        fill: "#E4F4E4",
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
        textColor: "#86681D",
        fill: "#FEF7E3",
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
        textColor: "#8F221B",
        fill: "#FCEBE2",
      },
      success: {
        count: 1,
        statuses: ["success"],
        textColor: "#116149",
        fill: "#E4F4E4",
      },
      "running-umbrella": {
        count: 1,
        statuses: ["started"],
        textColor: "#86681D",
        fill: "#FEF7E3",
      },
    });
  });
});
