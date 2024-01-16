import { queryString } from "utils";

const { parseQueryString } = queryString;

export interface Analytics<Action> {
  sendEvent: (action: Action) => void;
}

export type AnalyticsObject =
  | "Annotations"
  | "April Fools"
  | "Breadcrumb"
  | "CommitQueue"
  | "Configure"
  | "DistroSettings"
  | "HostPage"
  | "HostsTable"
  | "JobLogs"
  | "Navbar"
  | "Patch"
  | "Polling"
  | "PreferencesPages"
  | "ProjectHealthPages"
  | "ProjectPatches"
  | "ProjectSettings"
  | "Shortcut"
  | "SpawnPages"
  | "Task"
  | "TaskQueue"
  | "UserPatches"
  | "Version";

interface RequiredProperties {
  object: AnalyticsObject;
}

export interface ActionType {
  name: string;
}

export interface Properties {
  [key: string]: string | number;
}

export const addPageAction = <A extends ActionType, P extends Properties>(
  { name, ...actionProps }: A,
  properties: P & RequiredProperties,
) => {
  const { newrelic } = window;
  const { search } = window.location;
  const attributesToSend = {
    ...properties,
    ...parseQueryString(search),
    ...actionProps,
  };

  if (typeof newrelic !== "object") {
    // These will only print when new relic is not available such as during local development
    console.log("ANALYTICS EVENT ", { name, attributesToSend });
    return;
  }

  newrelic.addPageAction(name, attributesToSend);
};
