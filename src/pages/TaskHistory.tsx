import { H2 } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";
import { BuildVariantSelector } from "./taskHistory/BuildVariantSelector";

export const TaskHistory = () => {
  const { projectId, taskName } = useParams<{
    projectId: string;
    taskName: string;
  }>();

  usePageTitle(`Task History | ${projectId} | ${taskName}`);

  return (
    <PageWrapper>
      <H2>Task Name: {taskName}</H2>
      <BuildVariantSelector projectId={projectId} taskName={taskName} />
    </PageWrapper>
  );
};
