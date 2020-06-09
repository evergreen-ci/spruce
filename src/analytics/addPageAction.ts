import NewRelicAPI from "new-relic-browser";
import { parseQueryString } from "utils";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

interface ActionType {
  name: string;
}
interface RequiredProperties {
  object: "Patch" | "Task";
  userId: string;
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

  // console.log("analytics", { name, attributesToSend });

  if (typeof newrelic !== "object") {
    return;
  }

  newrelic.addPageAction(name, attributesToSend);
};
