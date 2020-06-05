import React, { useState, useContext } from "react";
import { isProduction } from "utils/getEnvironmentVariables";
import NewRelicAPI from "new-relic-browser";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI;
  }
}

type SendEvent = (
  eventName: string,
  attributes?: { [key: string]: string | string[] }
) => void;

interface Analytics {
  sendEvent: SendEvent;
}

const AnalyticsContext = React.createContext<Analytics | null>(null);

export const AnalyticsProvider: React.FC = ({ children }) => {
  const sendEvent: SendEvent = (eventName, attributes = {}) => {
    const { newrelic } = window;
    if (typeof window.newrelic !== "object" || !isProduction()) {
      return;
    }
  };

  const value = { sendEvent };
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};
