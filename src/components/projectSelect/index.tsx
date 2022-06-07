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
import { Unpacked } from "types/utils";
import { ProjectOptionGroup } from "./ProjectOptionGroup";

interface ProjectSelectProps {
  selectedProjectIdentifier: string;
  isProjectSettingsPage?: boolean;
  getRoute: (projectIdentifier: string) => string;
  onSubmit?: (projectIdentifier: string) => void;
}

// Split a list of projects into two arrays, one of enabled projects and one of disabled projects
const filterDisabledProjects = (
  projects: Unpacked<
    GetViewableProjectRefsQuery["viewableProjectRefs"]
  >["projects"]
) =>
  projects.reduce(
    ([enabled, disabled], project) =>
      project.enabled === false
        ? [enabled, [...disabled, project]]
        : [[...enabled, project], disabled],
    [[], []]
  );

export const ProjectSelect: React.VFC<ProjectSelectProps> = ({
  selectedProjectIdentifier,
  isProjectSettingsPage = false,
  getRoute,
  onSubmit = () => {},
}) => {
  const history = useHistory();

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

  const loading = isProjectSettingsPage
    ? viewableProjectsLoading
    : projectsLoading;

  const allProjects = getProjects(
    projectsData,
    viewableProjectsData,
    isProjectSettingsPage
  );

  // Find the project with the selectedProjectIdentifier and set it as the selected project
  const selectedProject = useMemo(
    () =>
      allProjects
        .flatMap((g) => g.projects)
        .find((p) => p.identifier === selectedProjectIdentifier),
    [allProjects, selectedProjectIdentifier]
  );

  const handleSearch = (options: typeof allProjects, value: string) => {
    // iterate through options and remove any groups that have no matching projects
    const filteredProjects = options.reduce((fp, g) => {
      const { groupDisplayName, projects: pg } = g;
      const newProjects = pg.filter(
        (p) =>
          p.displayName.toLowerCase().includes(value.toLowerCase()) ||
          p.identifier.toLowerCase().includes(value.toLowerCase())
      );
      if (newProjects.length > 0) {
        fp.push({ groupDisplayName, projects: newProjects });
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
          key={projectGroup.groupDisplayName}
          projects={projectGroup.projects}
          name={projectGroup.groupDisplayName}
          onClick={onClick}
          repoIdentifier={projectGroup?.repo?.id}
          canClickOnRepoGroup={isProjectSettingsPage && projectGroup?.repo?.id}
        />
      )}
      searchFunc={handleSearch}
      disabled={loading}
      valuePlaceholder="Select a project"
      data-cy="project-select"
    />
  );
};

const getFavoriteProjects = (projectGroups) =>
  projectGroups?.flatMap((g) => g.projects.filter((p) => p.isFavorite));

const getProjects = (
  projectsData: GetProjectsQuery,
  viewableProjectsData: GetViewableProjectRefsQuery,
  isProjectSettingsPage: boolean
) => {
  if (!isProjectSettingsPage) {
    const projectGroups = projectsData?.projects ?? [];
    return [
      {
        groupDisplayName: "Favorites",
        projects: getFavoriteProjects(projectGroups),
      },
      ...projectGroups,
    ];
  }

  // For Project Settings pages, move disabled projects to the bottom of the dropdown
  const projectGroups = viewableProjectsData?.viewableProjectRefs ?? [];

  const disabledProjects = [];
  const enabledProjectGroups = projectGroups.map((projectGroup) => {
    const [enabled, disabled] = filterDisabledProjects(projectGroup.projects);
    disabledProjects.push(...disabled);
    return {
      groupDisplayName: projectGroup.groupDisplayName,
      projects: enabled,
    };
  });

  const favoriteProjects = projectGroups?.flatMap((g) =>
    g.projects.filter((p) => p.isFavorite)
  );

  return [
    { groupDisplayName: "Favorites", projects: favoriteProjects },
    ...enabledProjectGroups,
    ...(disabledProjects.length
      ? [{ groupDisplayName: "Disabled Projects", projects: disabledProjects }]
      : []),
  ];
};
