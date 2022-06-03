import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { getCommitsRoute } from "constants/routes";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { GET_PROJECTS } from "gql/queries";
import { renderWithRouterMatch, act, waitFor } from "test_utils";
import { ProjectSelect } from ".";

describe("projectSelect", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets the currently selected project to what ever is passed in's display name", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectSelect
          selectedProjectIdentifier="evergreen"
          getRoute={getCommitsRoute}
        />
      </MockedProvider>
    );

    const { baseElement } = renderWithRouterMatch(<Component />);
    await waitFor(() => {
      expect(baseElement).toHaveTextContent("evergreen smoke test");
    });
  });

  it("should toggle dropdown when clicking on it", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectSelect
          selectedProjectIdentifier="evergreen"
          getRoute={getCommitsRoute}
        />
      </MockedProvider>
    );
    const { queryByDataCy } = renderWithRouterMatch(<Component />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
    userEvent.click(queryByDataCy("project-select"));
    expect(queryByDataCy("project-select-options")).toBeInTheDocument();
    userEvent.click(queryByDataCy("project-select"));
    expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
  });

  it("should narrow down search results when filtering on projects", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ProjectSelect
          selectedProjectIdentifier="evergreen"
          getRoute={getCommitsRoute}
        />
      </MockedProvider>
    );
    const { queryByDataCy, findAllByDataCy } = renderWithRouterMatch(
      <Component />
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(queryByDataCy("project-select-options")).not.toBeInTheDocument();
    userEvent.click(queryByDataCy("project-select"));
    expect(queryByDataCy("project-select-options")).toBeInTheDocument();
    let options = await findAllByDataCy("project-display-name");
    expect(options).toHaveLength(6);
    userEvent.type(queryByDataCy("project-select-search-input"), "logkeeper");
    options = await findAllByDataCy("project-display-name");
    expect(options).toHaveLength(1);
  });
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
