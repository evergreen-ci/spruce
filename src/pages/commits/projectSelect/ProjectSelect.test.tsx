import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { GET_PROJECTS } from "gql/queries";
import { render, act } from "test_utils/test-utils";
import { ProjectSelect } from ".";

test("Sets the currently selected project to what ever is passed in's display name", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectSelect selectedProject="evergreen" />
    </MockedProvider>
  );
  const { queryByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-name")).toHaveTextContent(
    "Project: evergreen smoke test"
  );
});

test("Should toggle dropdown when clicking on it ", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectSelect selectedProject="evergreen" />
    </MockedProvider>
  );
  const { queryByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
});

test("Should narrow down search results when filtering on projects", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks} addTypename={false}>
      <ProjectSelect selectedProject="evergreen" />
    </MockedProvider>
  );
  const { queryByDataCy, findAllByDataCy } = render(ContentWrapper());
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

  expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
  userEvent.click(queryByDataCy("project-select"));
  expect(queryByDataCy("project-select-options")).toBeInTheDocument();
  let options = await findAllByDataCy("project-display-name");
  expect(options.length).toBe(6);
  userEvent.type(queryByDataCy("project-search"), "logkeeper");
  options = await findAllByDataCy("project-display-name");
  expect(options.length).toBe(1);
});

const mocks = [
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
];
