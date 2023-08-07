import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, Overline } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { FavoriteStar } from "./FavoriteStar";

const { gray } = palette;

interface OptionProps {
  displayName: string;
  identifier: string;
  isFavorite: boolean;
  onClick: (identifier: string) => void;
}
const ProjectOption: React.FC<OptionProps> = ({
  displayName,
  identifier,
  isFavorite,
  onClick,
}) => (
  <ProjectContainer role="button" onClick={() => onClick(identifier)}>
    <Body data-cy="project-display-name">{displayName || identifier}</Body>
    <FavoriteStar identifier={identifier} isFavorite={isFavorite} />
  </ProjectContainer>
);

interface OptionGroupProps {
  name: string;
  repoIdentifier?: string;
  canClickOnRepoGroup?: boolean;
  projects: {
    displayName: string;
    identifier: string;
    isFavorite: boolean;
  }[];
  onClick: (identifier: string) => void;
}
export const ProjectOptionGroup: React.FC<OptionGroupProps> = ({
  canClickOnRepoGroup = false,
  name,
  onClick,
  projects,
  repoIdentifier,
}) => (
  <OptionGroupContainer>
    {/* if it's the project settings page and it's not the "" group, make the header clickable */}
    {canClickOnRepoGroup ? (
      <Overline
        css={hoverStyles}
        role="button"
        onClick={() => onClick(repoIdentifier)}
      >
        {name}
      </Overline>
    ) : (
      <Overline>{name}</Overline>
    )}

    <ListContainer>
      {projects?.map((project) => (
        <ProjectOption
          onClick={onClick}
          key={project.identifier}
          {...project}
        />
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
  padding: ${size.xxs} ${size.xxs} ${size.xxs} ${size.xs};
  :hover {
    background-color: ${gray.light1};
  }
`;

const OptionGroupContainer = styled.div`
  padding: ${size.xs};
  word-break: normal;
  overflow-wrap: anywhere;
`;

const hoverStyles = css`
  :hover {
    cursor: pointer;
    background-color: ${gray.light1};
  }
  padding: ${size.xs};
`;
