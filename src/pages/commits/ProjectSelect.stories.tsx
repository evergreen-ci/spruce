import { GET_PROJECTS } from "gql/queries";
import { ProjectSelect } from "./ProjectSelect";

export default {
  title: "ProjectSelect",
  component: ProjectSelect,
};

export const Story = () => <ProjectSelect />;

Story.parameters = {
  apolloClient: {
    mocks: [
      {
        request: {
          query: GET_PROJECTS,
        },
        result: {
          data: {
            projects: {
              favorites: [
                {
                  identifier: "evergreen",
                  repo: "evergreen",
                  owner: "evergreen-ci",
                  displayName: "evergreen smoke test",
                },
              ],
              otherProjects: [
                {
                  name: "evergreen-ci/evergreen",
                  projects: [
                    {
                      identifier: "evergreen",
                      repo: "evergreen",
                      owner: "evergreen-ci",
                      displayName: "evergreen smoke test",
                    },
                  ],
                },
                {
                  name: "logkeeper/logkeeper",
                  projects: [
                    {
                      identifier: "logkeeper",
                      repo: "logkeeper",
                      owner: "logkeeper",
                      displayName: "logkeeper",
                    },
                  ],
                },
                {
                  name: "mongodb/mongo",
                  projects: [
                    {
                      identifier: "sys-perf",
                      repo: "mongo",
                      owner: "mongodb",
                      displayName: "System Performance (main)",
                    },
                    {
                      identifier: "performance",
                      repo: "mongo",
                      owner: "mongodb",
                      displayName: "MongoDB Microbenchmarks (main)",
                    },
                  ],
                },
                {
                  name: "mongodb/mongodb",
                  projects: [
                    {
                      identifier: "mongodb-mongo-master",
                      repo: "mongodb",
                      owner: "mongodb",
                      displayName: "mongo",
                    },
                  ],
                },
                {
                  name: "mongodb/mongodb-test",
                  projects: [
                    {
                      identifier: "mongodb-mongo-test",
                      repo: "mongodb-test",
                      owner: "mongodb",
                      displayName: "mongo-test",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    ],
  },
};
