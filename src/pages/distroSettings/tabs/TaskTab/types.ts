import {
  FinderVersion,
  PlannerVersion,
  DispatcherVersion,
  Provider,
} from "gql/generated/types";

export interface TaskFormState {
  finderSettings: {
    version: FinderVersion;
  };
  plannerSettings: {
    version: PlannerVersion;
    tunableOptions: {
      targetTime: number;
      commitQueueFactor: number;
      expectedRuntimeFactor: number;
      generateTaskFactor: number;
      mainlineTimeInQueueFactor: number;
      patchFactor: number;
      patchTimeInQueueFactor: number;
      groupVersions: boolean;
    };
  };
  dispatcherSettings: {
    version: DispatcherVersion;
  };
}

export type TabProps = {
  distroData: TaskFormState;
  provider: Provider;
};
