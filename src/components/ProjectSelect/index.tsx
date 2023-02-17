import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import SearchableDropdown from "components/SearchableDropdown";
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

export const ProjectSelect: React.VFC<ProjectSelectProps> = ({
  selectedProjectIdentifier,
  isProjectSettingsPage = false,
  getRoute,
  onSubmit = () => {},
}) => {
  const navigate = useNavigate();

  const { data: projectsData, loading: projectsLoading } = useQuery<
    GetProjectsQuery,
    GetProjectsQueryVariables
  >(GET_PROJECTS, {
    skip: isProjectSettingsPage,
  });

  const { data: viewableProjectsData, loading: viewableProjectsLoading } =
    useQuery<GetViewableProjectRefsQuery, GetViewableProjectRefsQueryVariables>(
      GET_VIEWABLE_PROJECTS,
      {
        skip: !isProjectSettingsPage,
      }
    );

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
    const filteredProjects = options.reduce((acc, g) => {
      // @ts-expect-error
      const { groupDisplayName, projects: pg, repo } = g;

      const newProjects = pg.filter(
        (p) =>
          groupDisplayName.toLowerCase().includes(value.toLowerCase()) ||
          // @ts-expect-error
          p.displayName.toLowerCase().includes(value.toLowerCase()) ||
          // @ts-expect-error
          p.identifier.toLowerCase().includes(value.toLowerCase())
      );
      if (newProjects.length > 0) {
        // @ts-expect-error
        acc.push({
          groupDisplayName,
          projects: newProjects,
          ...(repo && { repo }),
        });
      }
      return acc;
      // @ts-expect-error
    }, [] as typeof allProjects);
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
        onSubmit(projectIdentifier);
        navigate(getRoute(projectIdentifier));
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
      // @ts-expect-error
      searchFunc={handleSearch}
      disabled={loading}
      valuePlaceholder="Select a project"
      data-cy="project-select"
    />
  );
};

const getFavoriteProjects = (
  projectGroups: Array<{
    projects: Array<{ isFavorite: boolean }>;
  }>
) => projectGroups?.flatMap((g) => g.projects.filter((p) => p.isFavorite));

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
      repo: projectGroup.repo,
    };
  });

  return [
    {
      groupDisplayName: "Favorites",
      projects: getFavoriteProjects(projectGroups),
    },
    ...enabledProjectGroups,
    ...(disabledProjects.length
      ? [{ groupDisplayName: "Disabled Projects", projects: disabledProjects }]
      : []),
  ];
};
