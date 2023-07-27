import { useEffect } from "react";

export const useAnalyticsAttributes = () => {
  const userId = localStorage.getItem("userId");
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
