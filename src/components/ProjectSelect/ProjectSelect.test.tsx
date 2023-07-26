import { MockedProvider } from "@apollo/client/testing";
import { getCommitsRoute, getProjectSettingsRoute } from "constants/routes";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  ProjectsQuery,
  ProjectsQueryVariables,
  ViewableProjectRefsQuery,
  ViewableProjectRefsQueryVariables,
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
        <MockedProvider mocks={getProjectsMock}>
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
        <MockedProvider mocks={getProjectsMock}>
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
        <MockedProvider mocks={getProjectsMock}>
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
        <MockedProvider mocks={getViewableProjectsMock}>
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
        <MockedProvider mocks={getViewableProjectsMock}>
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
        <MockedProvider mocks={getViewableProjectsMock}>
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
        <MockedProvider mocks={getViewableProjectsMock}>
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
        <MockedProvider mocks={getViewableProjectsMock}>
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
        <MockedProvider mocks={noDisabledProjectsMock}>
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

const getProjectsMock: [ApolloMock<ProjectsQuery, ProjectsQueryVariables>] = [
  {
    request: {
      query: GET_PROJECTS,
    },
    result: {
      data: {
        projects: [
          {
            __typename: "GroupedProjects",
            groupDisplayName: "evergreen-ci/evergreen",
            projects: [
              {
                __typename: "Project",
                displayName: "evergreen smoke test",
                id: "evergreen",
                identifier: "evergreen",
                isFavorite: false,
                owner: "evergreen-ci",
                repo: "evergreen",
              },
            ],
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "logkeeper/logkeeper",
            projects: [
              {
                __typename: "Project",
                displayName: "logkeeper",
                id: "logkeeper",
                identifier: "logkeeper",
                isFavorite: false,
                owner: "logkeeper",
                repo: "logkeeper",
              },
            ],
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "aaa/totally-different-name",
            projects: [
              {
                __typename: "Project",
                displayName: "System Performance (main)",
                id: "sys-perf",
                identifier: "sys-perf",
                isFavorite: false,
                owner: "mongodb",
                repo: "mongo",
              },
              {
                __typename: "Project",
                displayName: "MongoDB Microbenchmarks (main)",
                id: "performance",
                identifier: "performance",
                isFavorite: false,
                owner: "mongodb",
                repo: "mongo",
              },
            ],
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "mongodb/mongodb",
            projects: [
              {
                __typename: "Project",
                displayName: "mongo",
                id: "mongodb-mongo-master",
                identifier: "mongodb-mongo-master",
                isFavorite: false,
                owner: "mongodb",
                repo: "mongodb",
              },
            ],
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "mongodb/mongodb-test",
            projects: [
              {
                __typename: "Project",
                displayName: "mongo-test",
                id: "mongodb-mongo-test",
                identifier: "mongodb-mongo-test",
                isFavorite: false,
                owner: "mongodb",
                repo: "mongodb-test",
              },
            ],
          },
        ],
      },
    },
  },
];

const getViewableProjectsMock: [
  ApolloMock<ViewableProjectRefsQuery, ViewableProjectRefsQueryVariables>
] = [
  {
    request: {
      query: GET_VIEWABLE_PROJECTS,
    },
    result: {
      data: {
        viewableProjectRefs: [
          {
            __typename: "GroupedProjects",
            groupDisplayName: "evergreen-ci/evergreen",
            projects: [
              {
                __typename: "Project",
                displayName: "evergreen smoke test",
                enabled: false,
                id: "evergreen",
                identifier: "evergreen",
                isFavorite: false,
                owner: "evergreen-ci",
                repo: "evergreen",
              },
              {
                __typename: "Project",
                displayName: "spruce",
                enabled: true,
                id: "spruce",
                identifier: "spruce",
                isFavorite: false,
                owner: "evergreen-ci",
                repo: "spruce",
              },
            ],
            repo: {
              id: "12345",
            },
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "logkeeper/logkeeper",
            projects: [
              {
                __typename: "Project",
                displayName: "logkeeper",
                enabled: true,
                id: "logkeeper",
                identifier: "logkeeper",
                isFavorite: true,
                owner: "logkeeper",
                repo: "logkeeper",
              },
            ],
            repo: null,
          },
          {
            __typename: "GroupedProjects",
            groupDisplayName: "aaa/totally-different-name",
            projects: [
              {
                __typename: "Project",
                displayName: "spruce",
                enabled: true,
                id: "spruce",
                identifier: "spruce",
                isFavorite: false,
                owner: "spruce",
                repo: "spruce",
              },
            ],
            repo: {
              id: "56789",
            },
          },
        ],
      },
    },
  },
];

const noDisabledProjectsMock: [
  ApolloMock<ViewableProjectRefsQuery, ViewableProjectRefsQueryVariables>
] = [
  {
    request: {
      query: GET_VIEWABLE_PROJECTS,
    },
    result: {
      data: {
        viewableProjectRefs: [
          {
            __typename: "GroupedProjects",
            groupDisplayName: "evergreen-ci/evergreen",
            projects: [
              {
                __typename: "Project",
                displayName: "spruce",
                enabled: true,
                id: "spruce",
                identifier: "spruce",
                isFavorite: false,
                owner: "evergreen-ci",
                repo: "spruce",
              },
            ],
            repo: null,
          },
        ],
      },
    },
  },
];
