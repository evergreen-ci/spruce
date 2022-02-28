import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
import { CURRENT_PROJECT } from "constants/cookies";
import {
  getCommitsRoute,
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
  GetViewableProjectRefsQuery,
  GetViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECTS, GET_VIEWABLE_PROJECTS } from "gql/queries";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

interface ProjectSelectProps {
  selectedProjectIdentifier: string;
  isProjectSettingsPage?: boolean;
}
export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  selectedProjectIdentifier,
  isProjectSettingsPage,
}) => {
  const { projects, loading } = getProjects(isProjectSettingsPage);
  const history = useHistory();

  const favoriteProjects = projects.flatMap((g) =>
    g.projects.filter((p) => p.isFavorite)
  );

  const allProjects = [
    { name: "Favorites", projects: favoriteProjects },
    ...projects,
  ];
  // Find the project with the selectedProjectIdentifier and set it as the selected project
  const selectedProject = useMemo(
    () =>
      projects
        .flatMap((g) => g.projects)
        .find((p) => p.identifier === selectedProjectIdentifier),
    [projects, selectedProjectIdentifier]
  );

  const handleSearch = (options: typeof allProjects, value: string) => {
    // iterate through options and remove any groups that have no matching projects
    const filteredProjects = options.reduce((fp, g) => {
      const { name, projects: pg } = g;
      const newProjects = pg.filter(
        (p) =>
          p.displayName.toLowerCase().includes(value.toLowerCase()) ||
          p.identifier.toLowerCase().includes(value.toLowerCase())
      );
      if (newProjects.length > 0) {
        fp.push({ name, projects: newProjects });
      }
      return fp;
    }, [] as GetProjectsQuery["projects"]);
    return filteredProjects;
  };

  return (
    <SearchableDropdown
      label="Project"
      value={selectedProject?.displayName || selectedProject?.identifier}
      options={allProjects}
      onChange={(projectIdentifier: any) => {
        Cookies.set(CURRENT_PROJECT, projectIdentifier, { expires: 365 });
        history.push(
          isProjectSettingsPage
            ? getProjectSettingsRoute(
                projectIdentifier,
                ProjectSettingsTabRoutes.General
              )
            : getCommitsRoute(projectIdentifier)
        );
      }}
      optionRenderer={(projectGroup, onClick) => (
        <ProjectOptionGroup
          key={projectGroup.name}
          projects={projectGroup.projects}
          name={projectGroup.name}
          onClick={onClick}
        />
      )}
      searchFunc={handleSearch}
      disabled={loading}
      valuePlaceholder="Select a project"
      data-cy="project-select"
    />
  );
};

export const getProjects = (isProjectSettingsPage) => {
  if (!isProjectSettingsPage) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, loading } = useQuery<
      GetProjectsQuery,
      GetProjectsQueryVariables
    >(GET_PROJECTS);
    const { projects } = data || { projects: [] };

    return { projects, loading };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, loading } = useQuery<
    GetViewableProjectRefsQuery,
    GetViewableProjectRefsQueryVariables
  >(GET_VIEWABLE_PROJECTS);
  const { viewableProjectRefs } = data || { viewableProjectRefs: [] };
  // const projects = ;
  return { projects: viewableProjectRefs.map((p) => ({ ...p })), loading };
};
