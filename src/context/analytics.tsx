import React, { useContext } from "react";
import NewRelicAPI from "new-relic-browser";
import { useQuery } from "@apollo/react-hooks";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import get from "lodash/get";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line
  }
}

type SendEvent = (
  eventName: string,
  attributes?: { [key: string]: string | number }
) => void;

interface Analytics {
  sendEvent: SendEvent;
}

const AnalyticsContext = React.createContext<Analytics | null>(null);

export const AnalyticsProvider: React.FC = ({ children }) => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const userId = get(data, "user.userId", null);
  const { pathname } = useLocation();

  const sendEvent: SendEvent = (eventName, attributes = {}) => {
    const { newrelic } = window;
    if (typeof newrelic !== "object") {
      return;
    }
    newrelic.addPageAction(eventName, {
      ...attributes,
      userId,
      pathname,
    });
  };

  const value = { sendEvent };
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {
  const analytics = useContext(AnalyticsContext);
  if (analytics === undefined) {
    throw new Error(
      "useAnalyticsContext must be used within AnalyticsProvider"
    );
  }
  return analytics;
};
