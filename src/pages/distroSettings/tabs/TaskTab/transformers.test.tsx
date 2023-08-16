import {
  DistroInput,
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
} from "gql/generated/types";
import { distroData } from "../testData";
import { formToGql, gqlToForm } from "./transformers";
import { TaskFormState } from "./types";

describe("task tab", () => {
  it("correctly converts from GQL to a form", () => {
    expect(gqlToForm(distroData)).toStrictEqual(form);
  });

  it("correctly converts from a form to GQL", () => {
    expect(formToGql(form, distroData)).toStrictEqual(gql);
  });
});

const form: TaskFormState = {
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  plannerSettings: {
    version: PlannerVersion.Tunable,
    tunableOptions: {
      targetTime: 0,
      commitQueueFactor: 0,
      expectedRuntimeFactor: 0,
      generateTaskFactor: 5,
      mainlineTimeInQueueFactor: 0,
      patchFactor: 0,
      patchTimeInQueueFactor: 0,
      groupVersions: false,
    },
  },
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
};

const gql: DistroInput = {
  ...distroData,
  finderSettings: {
    version: FinderVersion.Legacy,
  },
  plannerSettings: {
    commitQueueFactor: 0,
    expectedRuntimeFactor: 0,
    generateTaskFactor: 5,
    groupVersions: false,
    mainlineTimeInQueueFactor: 0,
    patchFactor: 0,
    patchTimeInQueueFactor: 0,
    targetTime: 0,
    version: PlannerVersion.Tunable,
  },
  dispatcherSettings: {
    version: DispatcherVersion.RevisedWithDependencies,
  },
};
