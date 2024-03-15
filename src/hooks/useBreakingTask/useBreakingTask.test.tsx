// import { MockedProvider } from "@apollo/client/testing";
// import { MockToastContext } from "context/toast/__mocks__";
// import {
//   BaseVersionAndTaskQuery,
//   BaseVersionAndTaskQueryVariables,
//   LastMainlineCommitQuery,
//   LastMainlineCommitQueryVariables,
// } from "gql/generated/types";
// import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
// import { renderHook } from "test_utils";
// import { ApolloMock } from "types/gql";
// import { useBreakingTask } from ".";

// describe("useBreakingTask", () => {
//   beforeEach(() => {
//     MockToastContext();
//   });
//   it("no breaking task is found when task is not found", async () => {
//     const { result } = renderHook(() => useBreakingTask("task1"), {
//       wrapper: ({ children }) => (
//         <MockedProvider mocks={[]}>{children}</MockedProvider>
//       ),
//     });

//     expect(result.current.task).toBeUndefined();
//   });
//   it("a breaking task is found when there is a previous failing task", async () => {
//     const { result } = renderHook(() => useBreakingTask("task1"), {
//       wrapper: ({ children }) => (
//         <MockedProvider
//           mocks={[
//             getPatchTaskWithFailingBaseTask,
//             getLastPassingVersion,
//             getBreakingCommit,
//           ]}
//         >
//           {children}
//         </MockedProvider>
//       ),
//     });

//     expect(result.current.task).toBeUndefined();
//   });
// });

// const baseTaskId =
//   "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";

// const getPatchTaskWithFailingBaseTask: ApolloMock<
//   BaseVersionAndTaskQuery,
//   BaseVersionAndTaskQueryVariables
// > = {
//   request: {
//     query: BASE_VERSION_AND_TASK,
//     variables: {
//       taskId: "t1",
//     },
//   },
//   result: {
//     data: {
//       task: {
//         id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
//         execution: 0,
//         displayName: "lint-agent",
//         buildVariant: "lint",
//         projectIdentifier: "evergreen",
//         status: "failed",
//         versionMetadata: {
//           baseVersion: {
//             id: "baseVersion",
//             order: 3676,
//             __typename: "Version",
//           },
//           isPatch: true,
//           id: "versionMetadataId",
//           __typename: "Version",
//         },
//         baseTask: {
//           id: baseTaskId,
//           execution: 0,
//           status: "failed",
//           __typename: "Task",
//         },
//         __typename: "Task",
//       },
//     },
//   },
// };

// const getLastPassingVersion: ApolloMock<
//   LastMainlineCommitQuery,
//   LastMainlineCommitQueryVariables
// > = {
//   request: {
//     query: LAST_MAINLINE_COMMIT,
//     variables: {
//       projectIdentifier: "evergreen",
//       skipOrderNumber: 3676,
//       buildVariantOptions: {
//         tasks: ["^lint-agent$"],
//         variants: ["^lint$"],
//         statuses: ["success"],
//       },
//     },
//   },
//   result: {
//     data: {
//       mainlineCommits: {
//         versions: [
//           {
//             version: {
//               id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
//               buildVariants: [
//                 {
//                   tasks: [
//                     {
//                       id: "last_passing_task",
//                       execution: 0,
//                       order: 3674,
//                       status: "success",
//                       __typename: "Task",
//                     },
//                   ],
//                   __typename: "GroupedBuildVariant",
//                 },
//               ],
//               __typename: "Version",
//             },
//             __typename: "MainlineCommitVersion",
//           },
//         ],
//         __typename: "MainlineCommits",
//       },
//     },
//   },
// };

// const getBreakingCommit: ApolloMock<
//   LastMainlineCommitQuery,
//   LastMainlineCommitQueryVariables
// > = {
//   request: {
//     query: LAST_MAINLINE_COMMIT,
//     variables: {
//       projectIdentifier: "evergreen",
//       skipOrderNumber: 3676,
//       buildVariantOptions: {
//         tasks: ["^lint-agent$"],
//         variants: ["^lint$"],
//         statuses: ["failed"],
//       },
//     },
//   },
//   result: {
//     data: {
//       mainlineCommits: {
//         versions: [
//           {
//             version: {
//               id: "evergreen_44110b57c6977bf3557009193628c9389772163f2",
//               buildVariants: [
//                 {
//                   tasks: [
//                     {
//                       id: "breaking_commit",
//                       execution: 0,
//                       order: 3676,
//                       status: "failed",
//                       __typename: "Task",
//                     },
//                   ],
//                   __typename: "GroupedBuildVariant",
//                 },
//               ],
//               __typename: "Version",
//             },
//             __typename: "MainlineCommitVersion",
//           },
//         ],
//         __typename: "MainlineCommits",
//       },
//     },
//   },
// };
