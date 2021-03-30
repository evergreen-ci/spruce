import styled from "@emotion/styled";
import { Overline, Disclaimer } from "@leafygreen-ui/typography";
import { useHistory } from "react-router-dom";
import { getCommitRoute } from "constants/routes";
import { FavoriteStar } from "./FavoriteStar";

interface OptionProps {
  displayName: string;
  identifier: string;
  isFavorite: boolean;
}
const ProjectOption: React.FC<OptionProps> = ({
  displayName,
  isFavorite,
  identifier,
}) => {
  const history = useHistory();

  return (
    <ProjectContainer onClick={() => history.push(getCommitRoute(identifier))}>
      <Disclaimer data-cy="project-display-name">
        {displayName || identifier}
      </Disclaimer>
      <FavoriteStar identifier={identifier} isFavorite={isFavorite} />
    </ProjectContainer>
  );
};

interface OptionGroupProps {
  name: string;
  projects: {
    displayName: string;
    identifier: string;
    isFavorite: boolean;
  }[];
}
export const ProjectOptionGroup: React.FC<OptionGroupProps> = ({
  name,
  projects,
}) => (
  <OptionGroupContainer>
    <Overline>{name}</Overline>
    <ListContainer>
      {projects?.map((project) => (
        <ProjectOption key={project.identifier} {...project} />
      ))}
    </ListContainer>
  </OptionGroupContainer>
);

const ListContainer = styled.div`
  margin: 0;
  padding: 0;
`;

const ProjectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const OptionGroupContainer = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
