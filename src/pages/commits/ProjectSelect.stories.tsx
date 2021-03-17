import StoryRouter from "storybook-react-router";
import { ADD_FAVORITE_PROJECT, REMOVE_FAVORITE_PROJECT } from "gql/mutations";
import { GET_PROJECTS } from "gql/queries";
import WithToastContext from "test_utils/toast-decorator";
import { ProjectSelect } from "./ProjectSelect";

export default {
  title: "ProjectSelect",
  component: ProjectSelect,
  decorators: [StoryRouter(), (story) => WithToastContext(story)],
};

export const Story = () => <ProjectSelect selectedProject="evergreen" />;

Story.parameters = {
  apolloClient: {
    mocks: [
      {
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
      },
      {
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
      },
      {
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
      },
    ],
  },
};
