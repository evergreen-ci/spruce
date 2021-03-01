import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

export const TaskHistory = () => {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();

  usePageTitle(`Task History | ${projectId} | ${taskId}`);

  return <PageWrapper>The Future home of the Task History page</PageWrapper>;
};
