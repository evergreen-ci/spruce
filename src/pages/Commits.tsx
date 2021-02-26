import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";

export const Commits = () => {
  const { projectId } = useParams<{ projectId: string }>();

  usePageTitle(`Project Health | ${projectId}`);

  return <PageWrapper>The Future home of the project health page</PageWrapper>;
};
