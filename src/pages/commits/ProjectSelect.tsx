import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import Icon from "components/icons/Icon";
import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
  ProjectFragment,
} from "gql/generated/types";
import { GET_PROJECTS } from "gql/queries";
import { FavoriteStar } from "./projectSelect/FavoriteStar";
import { ProjectOptionGroup } from "./projectSelect/ProjectOptionGroup";

const { Search } = Input;
const { gray, white } = uiColors;

const filterProjects = (
  projects: ProjectFragment[],
  search: string,
  favoriteIdentifiers: string[]
) => {
  if (search !== "") {
    return projects.filter((project) => project.displayName.includes(search));
  }

  return projects.filter(
    (project) => !favoriteIdentifiers.includes(project.identifier)
  );
};

interface ProjectSelectProps {
  selectedProject: string;
}
export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  selectedProject,
}) => {
  const { data } = useQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GET_PROJECTS
  );
  const [isVisible, setisVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { projects } = data || {};
  const favorites = projects?.flatMap((g) =>
    g.projects.filter((p) => p.isFavorite)
  );
  const favoriteIdentifiers = favorites?.map((p) => p.identifier);

  const filteredProjects = projects?.reduce((op, p) => {
    const fp = filterProjects(p.projects, search, favoriteIdentifiers);
    if (fp.length > 0) {
      op.push({
        name: p.name,
        projects: fp,
      });
    }
    return op;
  }, []);

  const isFavoriteSelected =
    favoriteIdentifiers?.indexOf(selectedProject) !== -1;

  const sp = projects
    ?.flatMap((g) => g.projects)
    .find((p) => p.identifier === selectedProject);
  return (
    <Wrapper>
      <BarWrapper
        onClick={() => {
          setisVisible(!isVisible);
        }}
        data-cy="project-select"
      >
        <LabelWrapper>
          <Body data-cy="project-name">Project: {sp?.displayName}</Body>
        </LabelWrapper>
        <FlexWrapper>
          <FavoriteStar
            isFavorite={isFavoriteSelected}
            identifier={selectedProject}
            data-cy="favorite-selected-project"
          />
          <ArrowWrapper>
            <IconButton aria-label="Toggle Dropdown">
              <Icon glyph={isVisible ? "ChevronUp" : "ChevronDown"} />
            </IconButton>
          </ArrowWrapper>
        </FlexWrapper>
      </BarWrapper>
      {isVisible && (
        <RelativeWrapper>
          <OptionsWrapper data-cy="project-select-options">
            <Search
              placeholder="Search for project"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-cy="project-search"
            />
            <ProjectOptionGroup name="Favorites" projects={favorites} />
            {filteredProjects.map((p) => (
              <ProjectOptionGroup key={p.name} {...p} />
            ))}
          </OptionsWrapper>
        </RelativeWrapper>
      )}
    </Wrapper>
  );
};

const LabelWrapper = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BarWrapper = styled.div`
  border: 1px solid ${gray.light1};
  border-radius: 3px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
`;

const OptionsWrapper = styled.div`
  border-radius: 5px;
  background-color: ${white};
  border: 1px solid ${gray.light1};
  padding: 8px;
  box-shadow: 0 3px 8px 0 rgba(231, 238, 236, 0.5);
  position: absolute;
  z-index: 5;
  margin-top: 5px;
  width: 100%;
  overflow: hidden;
`;

// Used to provide a basis for the absolutely positions OptionsWrapper
const RelativeWrapper = styled.div`
  position: relative;
`;

const ArrowWrapper = styled.span`
  border-left: 1px solid ${gray.light1};
  padding-left: 5px;
`;

const Wrapper = styled.div`
  width: ${(props: { width?: string }): string =>
    props.width ? props.width : ""};
`;

const FlexWrapper = styled.div`
  display: flex;
`;
