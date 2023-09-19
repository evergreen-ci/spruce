import { useQuery } from "@apollo/client";
import get from "lodash/get";
import { useParams, useLocation } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  BuildBaronQuery,
  BuildBaronQueryVariables,
  AnnotationEventDataQuery,
  AnnotationEventDataQueryVariables,
} from "gql/generated/types";
import { ANNOTATION_EVENT_DATA, BUILD_BARON } from "gql/queries";
import { RequiredQueryParams } from "types/task";
import { queryString } from "utils";

const { parseQueryString } = queryString;
type Action =
  | { name: "Click Jira Summary Link" }
  | { name: "Build Baron File Ticket" }
  | { name: "Save Annotation Note" }
  | { name: "Click Annotation Ticket Link" }
  | { name: "Remove Annotation Issue" }
  | { name: "Remove Annotation Suspected Issue" }
  | { name: "Move Annotation Issue" }
  | { name: "Move Annotation Suspected Issue" }
  | { name: "Click Add Annotation Issue Button" }
  | { name: "Click Add Annotation Suspected Issue Button" }
  | { name: "Add Task Annotation Issue" }
  | { name: "Add Task Annotation Suspected Issue" };

export const useAnnotationAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const location = useLocation();
  const parsed = parseQueryString(location.search);
  const execution = Number(parsed[RequiredQueryParams.Execution]);
  const { data: eventData } = useQuery<
    AnnotationEventDataQuery,
    AnnotationEventDataQueryVariables
  >(ANNOTATION_EVENT_DATA, {
    variables: { taskId: id, execution },
    fetchPolicy: "cache-first",
  });

  const { data: bbData } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId: id, execution },
      fetchPolicy: "cache-first",
    }
  );

  const annotation = get(eventData, "task.annotation", undefined);
  const bbConfigured = get(
    bbData,
    "buildBaron.buildBaronConfigured",
    undefined
  );

  return useAnalyticsRoot<Action>("Annotations", {
    taskId: id,
    annotation,
    bbConfigured,
  });
};
