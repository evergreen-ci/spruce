import { useEffect } from "react";
import { useGetUserQuery } from "analytics/useGetUserQuery";

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
