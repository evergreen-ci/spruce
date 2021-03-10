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
import { ProjectOptionGroup } from "./projectSelect/ProjectOptionGroup";

const { Search } = Input;
const { gray, white } = uiColors;

const filterProjects = (projects: ProjectFragment[], search: string) => {
  if (search !== "") {
    return projects.filter((project) => project.displayName.includes(search));
  }
  return projects;
};

export const ProjectSelect = () => {
  const { data } = useQuery<GetProjectsQuery, GetProjectsQueryVariables>(
    GET_PROJECTS
  );
  const [isVisible, setisVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { projects } = data || {};
  const { favorites, otherProjects } = projects || {};

  const favoriteIdentifiers = favorites?.map((p) => p.identifier);
  const filteredProjects = otherProjects?.reduce((op, p) => {
    const fp = filterProjects(p.projects, search);
    if (fp.length > 0) {
      const fpWithFavorites = fp.map((f) => ({
        ...f,
        favorite: favoriteIdentifiers.includes(f.identifier),
      }));
      op.push({
        name: p.name,
        projects: fpWithFavorites,
      });
    }
    return op;
  }, []);

  const updatedFavorites = favorites?.map((p) => ({
    ...p,
    favorite: true,
  }));
  return (
    <Wrapper>
      <BarWrapper onClick={() => setisVisible(!isVisible)}>
        <LabelWrapper>
          <Body>Project: </Body>
        </LabelWrapper>
        <FlexWrapper>
          <IconButton aria-label="Add To Favorites">
            <Icon glyph="Favorite" />
          </IconButton>
          <ArrowWrapper>
            <IconButton aria-label="Toggle Dropdown">
              <Icon glyph={isVisible ? "ChevronUp" : "ChevronDown"} />
            </IconButton>
          </ArrowWrapper>
        </FlexWrapper>
      </BarWrapper>
      {isVisible && (
        <RelativeWrapper>
          <OptionsWrapper>
            <Search
              placeholder="Search for project"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ProjectOptionGroup name="Favorites" projects={updatedFavorites} />
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
  padding: 8px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  justify-content: space-between;
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
