import { MockedProvider } from "@apollo/client/testing";
import { getCommitsRoute, getProjectSettingsRoute } from "constants/routes";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  GetProjectsQuery,
  GetProjectsQueryVariables,
  GetViewableProjectRefsQuery,
  GetViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { GET_PROJECTS, GET_VIEWABLE_PROJECTS } from "gql/queries";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";

import { ProjectSelect } from ".";

describe("projectSelect", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("not project settings", () => {
    it("should show the project display name as the dropdown content", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getProjectsMock} addTypename={false}>
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

    it("should narrow down search results when filtering on projects", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getCommitsRoute}
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();

      let options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(6);
      userEvent.type(
        screen.queryByDataCy("project-select-search-input"),
        "logkeeper"
      );
      options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(1);
    });

    it("should be possible to search for projects by a repo name, which should NOT be clickable", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getCommitsRoute}
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();

      userEvent.type(
        screen.queryByDataCy("project-select-search-input"),
        "aaa/totally-different-name"
      );
      const options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(2);
      // Repo name should not be a clickable button.
      expect(
        screen.queryByRole("button", {
          name: "aaa/totally-different-name",
        })
      ).toBeNull();
    });
  });

  describe("project settings", () => {
    it("should show the project display name as the dropdown content", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getViewableProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      const { baseElement } = renderWithRouterMatch(<Component />);
      await waitFor(() => {
        expect(baseElement).toHaveTextContent("evergreen smoke test");
      });
    });

    it("should narrow down search results when filtering on projects", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getViewableProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();

      let options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(5);
      userEvent.type(
        screen.queryByDataCy("project-select-search-input"),
        "evergreen"
      );
      options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(2);
    });

    it("should be possible to search for projects by a repo name, which should be clickable", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getViewableProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();

      userEvent.type(
        screen.queryByDataCy("project-select-search-input"),
        "aaa/totally-different-name"
      );
      const options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(1);
      // Repo name should be a clickable button.
      expect(
        screen.getByRole("button", {
          name: "aaa/totally-different-name",
        })
      ).toBeInTheDocument();
    });

    it("shows favorited projects twice", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getViewableProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();
      // Favorited projects should appear twice.
      expect(screen.getAllByText("logkeeper")).toHaveLength(2);
    });

    it("shows disabled projects at the bottom of the list", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={getViewableProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="evergreen"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();

      const options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(5);
      // Disabled project appears last
      expect(options[4]).toHaveTextContent("evergreen smoke test");
      expect(screen.getByText("Disabled Projects")).toBeInTheDocument();
    });

    it("does not show a heading for disabled projects when all projects are enabled", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={noDisabledProjectsMock} addTypename={false}>
          <ProjectSelect
            selectedProjectIdentifier="spruce"
            getRoute={getProjectSettingsRoute}
            isProjectSettingsPage
          />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(screen.getByDataCy("project-select")).toBeInTheDocument();
      });
      expect(screen.queryByDataCy("project-select-options")).toBeNull();
      userEvent.click(screen.queryByDataCy("project-select"));
      expect(screen.getByDataCy("project-select-options")).toBeInTheDocument();
      const options = await screen.findAllByDataCy("project-display-name");
      expect(options).toHaveLength(1);
      expect(screen.queryByText("Disabled Projects")).not.toBeInTheDocument();
    });
  });
});

const getProjectsMock: [
  ApolloMock<GetProjectsQuery, GetProjectsQueryVariables>
] = [
  {
    request: {
      query: GET_PROJECTS,
    },
    result: {
      data: {
        projects: [
          {
            groupDisplayName: "evergreen-ci/evergreen",
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
            groupDisplayName: "logkeeper/logkeeper",
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
            groupDisplayName: "aaa/totally-different-name",
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
            groupDisplayName: "mongodb/mongodb",
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
            groupDisplayName: "mongodb/mongodb-test",
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

const getViewableProjectsMock: [
  ApolloMock<GetViewableProjectRefsQuery, GetViewableProjectRefsQueryVariables>
] = [
  {
    request: {
      query: GET_VIEWABLE_PROJECTS,
    },
    result: {
      data: {
        viewableProjectRefs: [
          {
            groupDisplayName: "evergreen-ci/evergreen",
            repo: {
              id: "12345",
            },
            projects: [
              {
                id: "evergreen",
                identifier: "evergreen",
                repo: "evergreen",
                owner: "evergreen-ci",
                displayName: "evergreen smoke test",
                isFavorite: false,
                enabled: false,
              },
              {
                id: "spruce",
                identifier: "spruce",
                repo: "spruce",
                owner: "evergreen-ci",
                displayName: "spruce",
                isFavorite: false,
                enabled: true,
              },
            ],
          },
          {
            groupDisplayName: "logkeeper/logkeeper",
            repo: null,
            projects: [
              {
                id: "logkeeper",
                identifier: "logkeeper",
                repo: "logkeeper",
                owner: "logkeeper",
                displayName: "logkeeper",
                isFavorite: true,
                enabled: true,
              },
            ],
          },
          {
            groupDisplayName: "aaa/totally-different-name",
            repo: {
              id: "56789",
            },
            projects: [
              {
                id: "spruce",
                identifier: "spruce",
                repo: "spruce",
                owner: "spruce",
                displayName: "spruce",
                isFavorite: false,
                enabled: true,
              },
            ],
          },
        ],
      },
    },
  },
];

const noDisabledProjectsMock: [
  ApolloMock<GetViewableProjectRefsQuery, GetViewableProjectRefsQueryVariables>
] = [
  {
    request: {
      query: GET_VIEWABLE_PROJECTS,
    },
    result: {
      data: {
        viewableProjectRefs: [
          {
            groupDisplayName: "evergreen-ci/evergreen",
            repo: null,
            projects: [
              {
                id: "spruce",
                identifier: "spruce",
                repo: "spruce",
                owner: "evergreen-ci",
                displayName: "spruce",
                isFavorite: false,
                enabled: true,
              },
            ],
          },
        ],
      },
    },
  },
];
