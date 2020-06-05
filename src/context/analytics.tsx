import React from "react";
import { isProduction } from "utils/getEnvironmentVariables";
import NewRelicAPI from "new-relic-browser";
import { useQuery } from "@apollo/react-hooks";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import get from "lodash/get";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI;
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
  console.log("pathname :>> ", pathname);

  const sendEvent: SendEvent = (eventName, attributes = {}) => {
    const { newrelic } = window;
    if (typeof window.newrelic !== "object" || !isProduction()) {
      return;
    }
    newrelic.addPageAction(eventName, {
      ...attributes,
      userId,
    });
  };

  const value = { sendEvent };
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalyticsContext = () => {};
