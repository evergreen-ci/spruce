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

interface ActionType {
  name: string;
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
export interface Properties {
  [key: string]: string | number;
}

export const addPageAction = <A extends ActionType, P extends Properties>(
  { name, ...actionProps }: A,
  properties: P & RequiredProperties
) => {
  let { newrelic } = window;
  console.log("hello");
  console.log("newrelic in func", newrelic);
  // if (typeof newrelic !== "object") {
  //   newrelic = {
  //     addPageAction: ()
  //   }
  // }
  console.log("55555");
  const { search } = window.location;
  newrelic.addPageAction(name, {
    ...properties,
    ...parseQueryString(search),
    ...actionProps,
  });
};
