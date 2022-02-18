import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
import { CURRENT_PROJECT } from "constants/cookies";
import { getCommitsRoute } from "constants/routes";
import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECTS } from "gql/queries";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

interface ProjectSelectProps {
  selectedProjectIdentifier: string;
}
export const ProjectSelect: React.FC<ProjectSelectProps> = ({
  selectedProjectIdentifier,
}) => {
  const { data, loading } = useQuery<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >(GET_PROJECTS);
  const history = useHistory();
  const { projects } = data || { projects: [] };

  const favoriteProjects = projects?.flatMap((g) =>
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
        history.push(getCommitsRoute(projectIdentifier));
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
