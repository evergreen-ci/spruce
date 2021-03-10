import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Overline, Disclaimer } from "@leafygreen-ui/typography";
import Icon from "components/icons/Icon";

const { green } = uiColors;
interface OptionProps {
  displayName: string;
  identifier: string;
  favorite: boolean;
}
const ProjectOption: React.FC<OptionProps> = ({ displayName, favorite }) => (
  <li>
    <ProjectContainer>
      <Disclaimer>{displayName}</Disclaimer>

      <IconButton aria-label="Add To Favorites">
        <Icon glyph="Favorite" fill={favorite && green.dark2} />
      </IconButton>
    </ProjectContainer>
  </li>
);

interface OptionGroupProps {
  name: string;
  projects: {
    displayName: string;
    identifier: string;
    favorite: boolean;
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

const ListContainer = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ProjectContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OptionGroupContainer = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;
