import { queryString } from "utils";

const { parseQueryString } = queryString;

export interface Analytics<Action> {
  sendEvent: (action: Action) => void;
}

type AnalyticsObject =
  | "April Fools"
  | "Patch"
  | "Version"
  | "Task"
  | "Annotations"
  | "Navbar"
  | "Breadcrumb"
  | "UserPatches"
  | "CommitQueue"
  | "Configure"
  | "HostsTable"
  | "HostPage"
  | "TaskQueue"
  | "SpawnPages"
  | "PreferencesPages"
  | "ProjectPatches"
  | "JobLogs"
  | "Polling"
  | "ProjectHealthPages"
  | "ProjectSettings";

interface RequiredProperties {
  object: AnalyticsObject;
}
interface ActionType {
  name: string;
}

export interface Properties {
  [key: string]: string | number;
}

export const addPageAction = <A extends ActionType, P extends Properties>(
  { name, ...actionProps }: A,
  properties: P & RequiredProperties
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
