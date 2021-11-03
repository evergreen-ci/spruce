import { addPageAction, Properties, Analytics } from "analytics/addPageAction";
import { useGetUserQuery } from "analytics/useGetUserQuery";

type Action =
  | { name: "Filter Hosts"; filterBy: string }
  | { name: "Sort Hosts" }
  | { name: "Change Page Size" }
  | { name: "Restart Jasper" }
  | { name: "Reprovision" }
  | { name: "Update Status"; status: string };

interface P extends Properties {}
interface HostsAnalytics extends Analytics<Action> {}

export const useHostsTableAnalytics = (
  isHostPage?: boolean
): HostsAnalytics => {
  const userId = useGetUserQuery();

  const sendEvent: HostsAnalytics["sendEvent"] = (action) => {
    addPageAction<Action, P>(action, {
      object: isHostPage ? "HostPage" : "HostsTable",
      userId,
    });
  };

  return { sendEvent };
};
