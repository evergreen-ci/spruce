import {
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables,
  ProjectsQuery,
  ProjectsQueryVariables,
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables,
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables,
} from "gql/generated/types";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";
import { PROJECTS, VIEWABLE_PROJECTS } from "gql/queries";
import { ApolloMock } from "types/gql";

const addFavoriteMock: ApolloMock<
  AddFavoriteProjectMutation,
  AddFavoriteProjectMutationVariables
> = {
  request: {
    query: ADD_FAVORITE_PROJECT,
    variables: { identifier: "evergreen" },
  },
  result: {
    data: {
      addFavoriteProject: {
        __typename: "Project",
        id: "evergreen",
        identifier: "evergreen",
        repo: "evergreen",
        owner: "evergreen-ci",
        displayName: "evergreen smoke test",
        isFavorite: true,
      },
    },
  },
};
const removeFavoriteMock: ApolloMock<
  RemoveFavoriteProjectMutation,
  RemoveFavoriteProjectMutationVariables
> = {
  request: {
    query: REMOVE_FAVORITE_PROJECT,
    variables: { identifier: "evergreen" },
  },
  result: {
    data: {
      removeFavoriteProject: {
        __typename: "Project",
        id: "evergreen",
        identifier: "evergreen",
        repo: "evergreen",
        owner: "evergreen-ci",
        displayName: "evergreen smoke test",
        isFavorite: false,
      },
    },
  },
};

const getProjectsMock: ApolloMock<ProjectsQuery, ProjectsQueryVariables> = {
  request: {
    query: PROJECTS,
  },
  result: {
    data: {
      projects: [
        {
          __typename: "GroupedProjects",
          groupDisplayName: "evergreen-ci/evergreen",
          projects: [
            {
              __typename: "Project",
              id: "evergreen",
              identifier: "evergreen",
              repo: "evergreen",
              owner: "evergreen-ci",
              displayName: "evergreen smoke test",
              isFavorite: false,
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "logkeeper/logkeeper",
          projects: [
            {
              __typename: "Project",
              id: "logkeeper",
              identifier: "logkeeper",
              repo: "logkeeper",
              owner: "logkeeper",
              displayName: "logkeeper",
              isFavorite: false,
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongo",
          projects: [
            {
              __typename: "Project",
              id: "sys-perf",
              identifier: "sys-perf",
              repo: "mongo",
              owner: "mongodb",
              displayName: "System Performance (main)",
              isFavorite: false,
            },
            {
              __typename: "Project",
              id: "performance",
              identifier: "performance",
              repo: "mongo",
              owner: "mongodb",
              displayName: "MongoDB Microbenchmarks (main)",
              isFavorite: false,
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongodb",
          projects: [
            {
              __typename: "Project",
              id: "mongodb-mongo-master",
              identifier: "mongodb-mongo-master",
              repo: "mongodb",
              owner: "mongodb",
              displayName: "mongo",
              isFavorite: false,
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongodb-test",
          projects: [
            {
              __typename: "Project",
              id: "mongodb-mongo-test",
              identifier: "mongodb-mongo-test",
              repo: "mongodb-test",
              owner: "mongodb",
              displayName: "mongo-test",
              isFavorite: false,
            },
          ],
        },
      ],
    },
  },
};

const viewableProjectsMock: ApolloMock<
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables
> = {
  request: {
    query: VIEWABLE_PROJECTS,
  },
  result: {
    data: {
      viewableProjectRefs: [
        {
          __typename: "GroupedProjects",
          groupDisplayName: "evergreen-ci/evergreen",
          projects: [
            {
              __typename: "Project",
              id: "evergreen",
              identifier: "evergreen",
              repo: "evergreen",
              owner: "evergreen-ci",
              displayName: "evergreen smoke test",
              isFavorite: false,
              enabled: true,
            },
          ],
          repo: {
            __typename: "RepoRef",
            id: "634d56d3850e610cacfe7e0b",
          },
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongodb-test",
          projects: [
            {
              __typename: "Project",
              id: "mongodb-mongo-test",
              identifier: "mongodb-mongo-test",
              repo: "mongodb-test",
              owner: "mongodb",
              displayName: "mongo-test",
              isFavorite: false,
              enabled: true,
            },
          ],
          repo: {
            __typename: "RepoRef",
            id: "6320b3d7850e613ee5b3bf8e",
          },
        },
      ],
    },
  },
};

const mocks = [
  addFavoriteMock,
  removeFavoriteMock,
  getProjectsMock,
  viewableProjectsMock,
];
export { mocks };
