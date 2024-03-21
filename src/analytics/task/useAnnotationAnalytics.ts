import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import { slugs } from "constants/routes";
import {
  BuildBaronQuery,
  BuildBaronQueryVariables,
  AnnotationEventDataQuery,
  AnnotationEventDataQueryVariables,
} from "gql/generated/types";
import { ANNOTATION_EVENT_DATA, BUILD_BARON } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { RequiredQueryParams } from "types/task";

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
  const { [slugs.id]: id } = useParams();
  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);

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
    },
  );

  const { annotation } = eventData?.task || {};
  const { buildBaronConfigured } = bbData?.buildBaron || {};

  return useAnalyticsRoot<Action>("Annotations", {
    taskId: id,
    annotation,
    bbConfigured: buildBaronConfigured,
  });
};
