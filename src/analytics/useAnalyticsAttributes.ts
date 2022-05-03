import { useEffect } from "react";
import { useGetUserQuery } from "analytics/useGetUserQuery";
import NewRelicAPI from "new-relic-browser";

declare global {
  interface Window {
    newrelic: typeof NewRelicAPI; // eslint-disable-line no-undef
  }
}

export const useAnalyticsAttributes = () => {
  const userId = useGetUserQuery();
  const { newrelic } = window;

  useEffect(() => {
    if (typeof newrelic !== "object") {
      console.log("Setting userId: ", userId);
      return;
    }
    if (userId !== null) {
      newrelic.setCustomAttribute("userId", userId);
    }
  }, [userId, newrelic]);
};
