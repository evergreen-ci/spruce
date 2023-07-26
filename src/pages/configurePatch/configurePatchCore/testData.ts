import {
  CodeChangesQuery,
  CodeChangesQueryVariables,
  ConfigurePatchQuery,
} from "gql/generated/types";
import { GET_CODE_CHANGES } from "gql/queries";
import { ApolloMock } from "types/gql";

export const patchQuery: ConfigurePatchQuery = {
  patch: {
    __typename: "Patch",
    activated: false,
    author: "mohamed.khelif",
    childPatchAliases: [
      {
        alias: "spruce",
        patchId: "5f4889313627e0544660c800",
      },
    ],
    childPatches: [],
    description: "test",
    id: "version",
    parameters: [],
    patchTriggerAliases: [
      {
        alias: "evergreen",
        childProjectId: "evergreen",
        childProjectIdentifier: "evergreen",
        variantsTasks: [
          {
            name: "evergreen",
            tasks: ["gqlgen", "lint"],
          },
        ],
      },
    ],
    project: {
      variants: [
        {
          displayName: "Ubuntu 20.04",
          name: "ubuntu2004",
          tasks: ["e2e_test", "test"],
        },
        {
          displayName: "Ubuntu 22.04",
          name: "ubuntu2204",
          tasks: ["e2e_test", "graphql"],
        },
      ],
    },
    projectIdentifier: "spruce",
    status: "created",
    time: {
      submittedAt: "2020-08-28T15:00:17Z",
    },
    variantsTasks: [],
  },
};

export const mocks: ApolloMock<CodeChangesQuery, CodeChangesQueryVariables>[] =
  [
    {
      request: {
        query: GET_CODE_CHANGES,
        variables: { id: "version" },
      },
      result: {
        data: {
          patch: {
            __typename: "Patch",
            id: "5f4889313627e0544660c800",
            moduleCodeChanges: [
              {
                __typename: "ModuleCodeChange",
                branchName: "main",
                fileDiffs: [
                  {
                    __typename: "FileDiff",
                    additions: 1,
                    deletions: 1,
                    description: "diff",
                    diffLink: "diff",
                    fileName: "diff",
                  },
                ],
                htmlLink: "htmlLink",
                rawLink: "rawLink",
              },
            ],
          },
        },
      },
    },
  ];
