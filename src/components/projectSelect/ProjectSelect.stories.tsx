import { getCommitsRoute } from "constants/routes";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";
import { GET_PROJECTS, GET_VIEWABLE_PROJECTS } from "gql/queries";
import WithToastContext from "test_utils/toast-decorator";
import { ProjectSelect } from ".";

export default {
  title: "ProjectSelect",
  component: ProjectSelect,
  decorators: [(story) => WithToastContext(story)],
};

export const WithClickableHeader = () => (
  <ProjectSelect
    selectedProjectIdentifier="evergreen"
    getRoute={getCommitsRoute}
    isProjectSettingsPage
  />
);

export const Default = () => (
  <ProjectSelect
    selectedProjectIdentifier="evergreen"
    getRoute={getCommitsRoute}
  />
);
const addFavoriteMock = {
  request: {
    query: ADD_FAVORITE_PROJECT,
    variables: { identifier: "evergreen" },
  },
  result: {
    data: {
      addFavoriteProject: {
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
const removeFavoriteMock = {
  request: {
    query: REMOVE_FAVORITE_PROJECT,
    variables: { identifier: "evergreen" },
  },
  result: {
    data: {
      addFavoriteProject: {
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

const getProjectsMock = {
  request: {
    query: GET_PROJECTS,
  },
  result: {
    data: {
      projects: [
        {
          name: "evergreen-ci/evergreen",
          projects: [
            {
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
          name: "logkeeper/logkeeper",
          projects: [
            {
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
          name: "mongodb/mongo",
          projects: [
            {
              id: "sys-perf",
              identifier: "sys-perf",
              repo: "mongo",
              owner: "mongodb",
              displayName: "System Performance (main)",
              isFavorite: false,
            },
            {
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
          name: "mongodb/mongodb",
          projects: [
            {
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
          name: "mongodb/mongodb-test",
          projects: [
            {
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

const viewableProjectsMock = {
  request: {
    query: GET_VIEWABLE_PROJECTS,
  },
  result: {
    data: {
      viewableProjectRefs: [
        {
          name: "evergreen-ci/evergreen",
          projects: [
            {
              id: "evergreen",
              identifier: "evergreen",
              repo: "evergreen",
              repoRefId: "evergreen",
              owner: "evergreen-ci",
              displayName: "evergreen smoke test",
              isFavorite: false,
            },
          ],
        },
        {
          name: "mongodb/mongodb-test",
          projects: [
            {
              id: "mongodb-mongo-test",
              identifier: "mongodb-mongo-test",
              repo: "mongodb-test",
              repoRefId: "mongodb-test",
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

Default.parameters = {
  apolloClient: {
    mocks: [getProjectsMock, addFavoriteMock, removeFavoriteMock],
  },
};

WithClickableHeader.parameters = {
  apolloClient: {
    mocks: [
      getProjectsMock,
      viewableProjectsMock,
      addFavoriteMock,
      removeFavoriteMock,
    ],
  },
};
