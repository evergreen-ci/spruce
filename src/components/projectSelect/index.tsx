import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
import { CURRENT_PROJECT } from "constants/cookies";
import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
  GetViewableProjectRefsQuery,
  GetViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECTS, GET_VIEWABLE_PROJECTS } from "gql/queries";
import { errorReporting } from "utils";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

type Project = {
  displayName: string;
  identifier: string;
  repoRefId: string;
  isFavorite: boolean;
};
interface ProjectSelectProps {
  selectedProjectIdentifier: string;
  isProjectSettingsPage?: boolean;
  getRoute: (projectIdentifier: string) => string;
  onSubmit?: (projectIdentifier: string) => void;
}
export const ProjectSelect: React.VFC<ProjectSelectProps> = ({
  selectedProjectIdentifier,
  isProjectSettingsPage = false,
  getRoute,
  onSubmit = () => {},
}) => {
  const { data: projectsData, loading: projectsLoading } = useQuery<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >(GET_PROJECTS, {
    skip: isProjectSettingsPage,
  });

  const {
    data: viewableProjectsData,
    loading: viewableProjectsLoading,
  } = useQuery<
    GetViewableProjectRefsQuery,
    GetViewableProjectRefsQueryVariables
  >(GET_VIEWABLE_PROJECTS, {
    skip: !isProjectSettingsPage,
  });

  const projects = getProjects(projectsData, viewableProjectsData);
  const loading = viewableProjectsLoading || projectsLoading;

  const history = useHistory();

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

  if (allProjects.length === 0 || loading) {
    return null;
  }

  return (
    <SearchableDropdown
      label="Project"
      value={
        selectedProject?.displayName ||
        selectedProject?.identifier ||
        selectedProjectIdentifier
      }
      options={allProjects}
      onChange={(projectIdentifier: any) => {
        Cookies.set(CURRENT_PROJECT, projectIdentifier, { expires: 365 });
        onSubmit(projectIdentifier);
        history.push(getRoute(projectIdentifier));
      }}
      optionRenderer={(projectGroup, onClick) => (
        <ProjectOptionGroup
          key={projectGroup.name}
          projects={projectGroup.projects}
          name={projectGroup.name}
          onClick={onClick}
          repoIdentifier={
            isProjectSettingsPage && getRepoId(projectGroup.projects)
          }
          canClickOnRepoGroup={
            isProjectSettingsPage && getRepoId(projectGroup.projects) !== ""
          }
        />
      )}
      searchFunc={handleSearch}
      disabled={loading}
      valuePlaceholder="Select a project"
      data-cy="project-select"
    />
  );
};

const { reportError } = errorReporting;

export const getRepoId = (projects: Project[]) => {
  if (!projects || projects.length === 0) {
    reportError(
      new Error("No projects provided when fetching repo id")
    ).warning();
    return "";
  }
  return projects[0].repoRefId;
};

export const getProjects = (
  nonFilteredProjects: GetProjectsQuery,
  filteredProjects: GetViewableProjectRefsQuery
) => {
  const { projects } = nonFilteredProjects || { projects: [] };
  const { viewableProjectRefs } = filteredProjects || {
    viewableProjectRefs: [],
  };
  const mappedFilteredProjects = viewableProjectRefs.map((p) => ({ ...p }));

  if (mappedFilteredProjects.length !== 0) {
    return mappedFilteredProjects;
  }
  return projects;
};
