import { TaskStatus } from "types/task";
import { groupTasksByUmbrellaStatus } from "./utils";

describe("groupTasksByUmbrellaStatus", () => {
  it("seperates tasks into groups based on their umbrella status", () => {
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
      [TaskStatus.FailedUmbrella]: {
        count: 1,
        statuses: { [TaskStatus.Failed]: 1 },
      },
      [TaskStatus.Succeeded]: {
        count: 1,
        statuses: { [TaskStatus.Succeeded]: 1 },
      },
      [TaskStatus.RunningUmbrella]: {
        count: 1,
        statuses: { [TaskStatus.Started]: 1 },
      },
    });
  });
  it("differing task statuses are grouped to the same umbrella status", () => {
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
      [TaskStatus.FailedUmbrella]: {
        count: 2,
        statuses: { failed: 1, [TaskStatus.TaskTimedOut]: 1 },
      },
      [TaskStatus.Succeeded]: {
        count: 1,
        statuses: { [TaskStatus.Succeeded]: 1 },
      },
      [TaskStatus.RunningUmbrella]: {
        count: 1,
        statuses: { [TaskStatus.Started]: 1 },
      },
    });
  });
  it("keeps an accurate count of tasks with the same status and doesnt duplicate statuses", () => {
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
      [TaskStatus.FailedUmbrella]: {
        count: 2,
        statuses: { [TaskStatus.Failed]: 2 },
      },
      [TaskStatus.Succeeded]: {
        count: 1,
        statuses: { [TaskStatus.Succeeded]: 1 },
      },
      [TaskStatus.RunningUmbrella]: {
        count: 1,
        statuses: { [TaskStatus.Started]: 1 },
      },
    });
  });
});
