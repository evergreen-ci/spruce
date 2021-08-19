import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body, Overline } from "@leafygreen-ui/typography";
import { useHistory } from "react-router-dom";
import { getCommitsRoute } from "constants/routes";
import { FavoriteStar } from "./FavoriteStar";

const { gray } = uiColors;

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
    <ProjectContainer onClick={() => history.push(getCommitsRoute(identifier))}>
      <Body data-cy="project-display-name">{displayName || identifier}</Body>
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
  padding: 10px 12px;
  :hover {
    background-color: ${gray.light1};
  }
`;

const OptionGroupContainer = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
