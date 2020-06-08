import { useQuery } from "@apollo/react-hooks";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import get from "lodash/get";
import { useLocation } from "react-router-dom";
import NewRelicAPI from "new-relic-browser";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

type SendEvent = (
  eventName: string,
  attributes?: { [key: string]: string | number }
) => void;

interface Analytics {
  sendEvent: SendEvent;
}

export const useAnalytics = (): Analytics => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const userId = get(data, "user.userId", null);
  const { search } = useLocation();

  const sendEvent: SendEvent = (eventName, attributes = {}) => {
    const { newrelic } = window;
    if (typeof newrelic !== "object") {
      return;
    }
    newrelic.addPageAction(eventName, {
      ...attributes,
      userId,
      urlSearch: search,
    });
  };

  return {
    sendEvent,
  };
};
