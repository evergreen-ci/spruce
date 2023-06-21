import { ConfigurePatchQuery } from "gql/generated/types";

export const patchQuery: ConfigurePatchQuery = {
  patch: {
    __typename: "Patch",
    id: "5f4889313627e0544660c800",
    description: "test",
    projectIdentifier: "spruce",
    author: "mohamed.khelif",
    activated: false,
    status: "created",
    patchTriggerAliases: [
      {
        alias: "spruce",
        childProjectId: "spruce",
        childProjectIdentifier: "spruce",
        variantsTasks: [
          {
            name: "spruce",
            tasks: ["gqlgen", "lint"],
          },
        ],
      },
    ],
    childPatchAliases: [
      {
        alias: "spruce",
        patchId: "5f4889313627e0544660c800",
      },
    ],
    childPatches: [],
    parameters: [],
    variantsTasks: [],
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
  },
};
