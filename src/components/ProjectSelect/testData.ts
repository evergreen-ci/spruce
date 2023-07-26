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
import { GET_PROJECTS, GET_VIEWABLE_PROJECTS } from "gql/queries";
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
        displayName: "evergreen smoke test",
        id: "evergreen",
        identifier: "evergreen",
        isFavorite: true,
        owner: "evergreen-ci",
        repo: "evergreen",
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
        displayName: "evergreen smoke test",
        id: "evergreen",
        identifier: "evergreen",
        isFavorite: false,
        owner: "evergreen-ci",
        repo: "evergreen",
      },
    },
  },
};

const getProjectsMock: ApolloMock<ProjectsQuery, ProjectsQueryVariables> = {
  request: {
    query: GET_PROJECTS,
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
              displayName: "evergreen smoke test",
              id: "evergreen",
              identifier: "evergreen",
              isFavorite: false,
              owner: "evergreen-ci",
              repo: "evergreen",
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "logkeeper/logkeeper",
          projects: [
            {
              __typename: "Project",
              displayName: "logkeeper",
              id: "logkeeper",
              identifier: "logkeeper",
              isFavorite: false,
              owner: "logkeeper",
              repo: "logkeeper",
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongo",
          projects: [
            {
              __typename: "Project",
              displayName: "System Performance (main)",
              id: "sys-perf",
              identifier: "sys-perf",
              isFavorite: false,
              owner: "mongodb",
              repo: "mongo",
            },
            {
              __typename: "Project",
              displayName: "MongoDB Microbenchmarks (main)",
              id: "performance",
              identifier: "performance",
              isFavorite: false,
              owner: "mongodb",
              repo: "mongo",
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongodb",
          projects: [
            {
              __typename: "Project",
              displayName: "mongo",
              id: "mongodb-mongo-master",
              identifier: "mongodb-mongo-master",
              isFavorite: false,
              owner: "mongodb",
              repo: "mongodb",
            },
          ],
        },
        {
          __typename: "GroupedProjects",
          groupDisplayName: "mongodb/mongodb-test",
          projects: [
            {
              __typename: "Project",
              displayName: "mongo-test",
              id: "mongodb-mongo-test",
              identifier: "mongodb-mongo-test",
              isFavorite: false,
              owner: "mongodb",
              repo: "mongodb-test",
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
    query: GET_VIEWABLE_PROJECTS,
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
              displayName: "evergreen smoke test",
              enabled: true,
              id: "evergreen",
              identifier: "evergreen",
              isFavorite: false,
              owner: "evergreen-ci",
              repo: "evergreen",
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
              displayName: "mongo-test",
              enabled: true,
              id: "mongodb-mongo-test",
              identifier: "mongodb-mongo-test",
              isFavorite: false,
              owner: "mongodb",
              repo: "mongodb-test",
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
