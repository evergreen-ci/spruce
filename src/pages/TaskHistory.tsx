import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

export const TaskHistory = () => {
  const { projectId, taskId } = useParams<{
    projectId: string;
    taskId: string;
  }>();

  usePageTitle(`Task History | ${projectId} | ${taskId}`);

  return (
    <PageWrapper>
      <H2>Task Name: {taskId}</H2>
    </PageWrapper>
  );
};
