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
  | "Configure";

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
  if (typeof newrelic !== "object") {
    return;
  }
  const { search } = window.location;
  newrelic.addPageAction(name, {
    ...properties,
    ...parseQueryString(search),
    ...actionProps,
  });
};
