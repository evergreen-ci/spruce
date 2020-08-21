import NewRelicAPI from "new-relic-browser";
import { parseQueryString } from "utils";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

export interface Analytics<Action> {
  sendEvent: (action: Action) => void;
}

type AnalyticsObject =
  | "Patch"
  | "Task"
  | "Navbar"
  | "Breadcrumb"
  | "UserPatches"
  | "CommitQueue"
  | "Configure"
  | "HostsTable"
  | "HostsPage";

interface RequiredProperties {
  object: AnalyticsObject;
  userId: string;
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
    console.log(name);
    console.log("attributesToSend", attributesToSend);
    return;
  }

  newrelic.addPageAction(name, attributesToSend);
};
