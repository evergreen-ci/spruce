import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { PageWrapper } from "components/styles";
import { TupleSelect } from "components/TupleSelect";
import { usePageTitle } from "hooks";
import { ProjectFilterOptions } from "types/commits";
import { ProjectSelect } from "./commits/ProjectSelect";

export const Commits = () => {
  const { projectId } = useParams<{ projectId: string }>();

  usePageTitle(`Project Health | ${projectId}`);

  return (
    <PageWrapper>
      <HeaderWrapper>
        <TupleSelectWrapper>
          <TupleSelect options={tupleSelectOptions} />
        </TupleSelectWrapper>
        <ProjectSelectWrapper>
          <ProjectSelect selectedProject={projectId} />
        </ProjectSelectWrapper>
      </HeaderWrapper>
    </PageWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TupleSelectWrapper = styled.div`
  width: 40%;
`;
const ProjectSelectWrapper = styled.div`
  width: 30%;
`;
const tupleSelectOptions = [
  {
    value: ProjectFilterOptions.BuildVariant,
    displayName: "Build Variant",
    placeHolderText: "Search Build Variant names",
  },
  {
    value: ProjectFilterOptions.Test,
    displayName: "Test",
    placeHolderText: "Search Test names",
  },
  {
    value: ProjectFilterOptions.Task,
    displayName: "Task",
    placeHolderText: "Search Task names",
  },
];
