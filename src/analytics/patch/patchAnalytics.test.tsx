// import React from "react";
// import { MockedProvider } from "@apollo/react-testing";
// import {
//   render,
//   fireEvent,
//   queryHelpers,
//   waitFor,
//   screen,
// } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// import { GET_USER, GET_PATCH, GET_PATCH_TASK_STATUSES } from "gql/queries";
// import { TaskFilters } from "pages/patch/patchTabs/tasks/TaskFilters";
// import { PatchTabs } from "pages/patch/PatchTabs";
// import { ContextProviders } from "context/Providers";
// import wait from "waait";
// import { act } from "react-dom/test-utils";
// import { GET_PATCH_EVENT_DATA } from "analytics/patch/query";
// import { ErrorBoundary } from "components/ErrorBoundary";
// import { Router } from "react-router-dom";
// import { createMemoryHistory } from "history";

// // @ts-ignore
// window.newrelic = {
//   addPageAction: jest.fn(),
// };

// jest.mock("@bugsnag/js", () => () => ({
//   start: jest.fn(),
//   use(plugin) {
//     const boundary = plugin.init();
//     delete boundary.prototype.componentDidCatch;
//     return boundary;
//   },
// }));

// // jest.mock("react-router-dom", () => ({
// //   useLocation: jest.fn().mockReturnValue({
// //     search: "?page=0&statuses=failed,success&taskName=cloud&variant=ubun",
// //     pathname: "pathname",
// //   }),
// //   useHistory: jest.fn().mockReturnValue({ replace: jest.fn() }),
// //   useParams: jest.fn().mockReturnValue({ id: "123" }),
// // }));

// test("Interacting with tracked HTML elements calls addPageAction function with correct params", async () => {
//   const history = createMemoryHistory();
//   history.push(
//     "/patch/123/tasks?page=0&statuses=failed,success&taskName=cloud&variant=ubun"
//   );
//   const { container, debug } = render(
//     <Router history={history}>
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <ContextProviders>
//           <PatchTabs taskCount={10} />
//         </ContextProviders>
//       </MockedProvider>
//     </Router>
//   );

//   // await act(async () => await wait(0));
//   fireEvent.click(
//     queryHelpers.queryByAttribute("data-cy", container, "changes-tab")
//   );

//   expect(window.newrelic.addPageAction).toHaveBeenCalledWith("Filter Tasks", {
//     patchId: "123",
//     patchStatus: undefined,
//     object: "Patch",
//     page: 0,
//     statuses: ["failed", "success"],
//     taskName: "cloud",
//     variant: "ubun",
//     userId: "happy-user",
//     tab: "changes",
//     // filterBy: "taskName",
//   });
// });

// const patchId = "abc";
// const mocks = [
//   {
//     request: {
//       query: GET_USER,
//     },
//     result: {
//       data: {
//         user: {
//           userId: "happy-user",
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: GET_PATCH,
//       variables: {
//         id: patchId,
//       },
//     },
//     result: {
//       data: {
//         patch: {
//           id: patchId,
//           status: "failed",
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: GET_PATCH_EVENT_DATA,
//       variables: {
//         id: patchId,
//       },
//     },
//     result: {
//       data: {
//         patch: {
//           id: patchId,
//           status: "failed",
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: GET_PATCH_TASK_STATUSES,
//       variables: {
//         id: patchId,
//       },
//     },
//     result: {
//       data: {
//         patch: {
//           id: patchId,
//           taskStatuses: ["failed"],
//         },
//       },
//     },
//   },
// ];
