import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { usePageTitle } from "hooks";
import { ProjectSelect } from "./commits/ProjectSelect";

export const Commits = () => {
  const { projectId } = useParams<{ projectId: string }>();

  usePageTitle(`Project Health | ${projectId}`);

  return (
    <PageWrapper>
      The Future home of the project health page
      <ProjectSelectWrapper>
        <ProjectSelect selectedProject={projectId} />
      </ProjectSelectWrapper>
    </PageWrapper>
  );
};

const ProjectSelectWrapper = styled.div`
  width: 380px;
`;
