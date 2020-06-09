import React from "react";
import { PatchStatus } from "types/patch";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import get from "lodash/get";
import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
import { GetUserQuery } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { addPageAction, Properties } from "analytics/addPageAction";

type Action =
  | { name: "Filter Tasks" }
  | { name: "Restart"; abort: boolean }
  | { name: "Schedule" }
  | { name: "Set Priority" }
  | { name: "Abort" }
  | { name: "Unschedule" }
  | { name: "Paginate" }
  | { name: "Change Tab" }
  | { name: "Add Notificaiton" }
  | { name: "Click Variant Square" };

interface P extends Properties {
  patchId: string;
  patchStatus: PatchStatus;
}

type SendEvent = (action: Action) => void;

interface PatchAnalytics {
  sendEvent: SendEvent;
}

const PatchAnalyticsContext = React.createContext<PatchAnalytics | null>(null);

export const PatchAnalyticsProvider: React.FC = ({ children }) => {
  const { data } = useQuery<GetUserQuery>(GET_USER);
  const { id } = useParams<{ id: string }>();
  const { data: eventData } = useQuery(GET_PATCH_EVENT_DATA, {
    variables: { id },
  });
  const status = get(eventData, "patch.status", undefined);
  const userId = get(data, "user.userId", null);

  const sendEvent: SendEvent = (action) => {
    addPageAction<Action, P>(action, {
      object: "Patch",
      userId,
      patchStatus: status,
      patchId: id,
    });
  };

  const analytics = { sendEvent };
  return (
    <PatchAnalyticsContext.Provider value={analytics}>
      {children}
    </PatchAnalyticsContext.Provider>
  );
};

export const usePatchAnalytics = () => {
  const analytics = React.useContext(PatchAnalyticsContext);
  if (analytics === undefined) {
    throw new Error(
      "useAnalytics must be used within a PatchAnalyticsContext.Provider"
    );
  }
  return analytics;
};
