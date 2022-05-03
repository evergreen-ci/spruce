import { useQuery } from "@apollo/client";

import { useToastContext } from "context/toast";
import {
  GetIssuesQuery,
  GetIssuesQueryVariables,
  Annotation,
} from "gql/generated/types";
import { GET_JIRA_ISSUES } from "gql/queries";
import AnnotationTickets from "./AnnotationTickets";

interface IssuesProps {
  taskId: string;
  execution: number;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (selectedRowKey: string) => void;
  annotation: Annotation;
}

const Issues: React.VFC<IssuesProps> = ({
  taskId,
  execution,
  userCanModify,
  selectedRowKey,
  setSelectedRowKey,
  annotation,
}) => {
  const dispatchToast = useToastContext();
  // Query Jira ticket data
  const { data, loading } = useQuery<GetIssuesQuery, GetIssuesQueryVariables>(
    GET_JIRA_ISSUES,
    {
      variables: { taskId, execution },
      onError: (err) => {
        dispatchToast.error(
          `There was an error loading the ticket information from Jira: ${err.message}`
        );
      },
    }
  );
  return (
    <AnnotationTickets
      tickets={data?.task?.annotation?.issues || annotation?.issues || []}
      taskId={taskId}
      execution={execution}
      userCanModify={userCanModify}
      selectedRowKey={selectedRowKey}
      setSelectedRowKey={setSelectedRowKey}
      loading={loading}
      isIssue
    />
  );
};

export default Issues;
