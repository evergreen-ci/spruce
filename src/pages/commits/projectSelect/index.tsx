import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
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
    }, [] as typeof allProjects);
    return filteredProjects;
  };

  return (
    <SearchableDropdown
      label="Project"
      value={selectedProject?.displayName || selectedProject?.identifier}
      options={allProjects}
      onChange={(projectIdentifier: any) => {
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
    />
  );
};
