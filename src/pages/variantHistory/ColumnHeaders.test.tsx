import { ProviderWrapper } from "components/HistoryTable/hooks/test-utils";
import { variantHistoryMaxLength as maxLength } from "constants/history";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables,
} from "gql/generated/types";
import { TASK_NAMES_FOR_BUILD_VARIANT } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { string } from "utils";
import ColumnHeaders from "./ColumnHeaders";

const { trimStringFromMiddle } = string;
const longTaskName = "really_really_really_really_really_really_long_task_name";
const trimmedTaskName = trimStringFromMiddle(longTaskName, maxLength);

describe("columnHeaders (Variant History)", () => {
  it("renders an initial skeleton for the 7 column headers when loading", () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ProviderWrapper,
    });
    expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(7);
  });

  it("renders the column headers properly when not loading", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3"],
          },
          mocks: [mock(["task1", "task2", "task3"])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });

    expect(screen.queryAllByDataCy("header-cell")).toHaveLength(3);
  });

  it("should link to corresponding /task-history/:projectId/:taskName page", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: ["task1"],
          },
          mocks: [mock(["task1"])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(screen.queryByRole("link")).toHaveAttribute(
      "href",
      "/task-history/evergreen/task1",
    );
  });

  it("should not show more column headers then the columnLimit", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: ["task1", "task2", "task3", "task4", "task5"],
            columnLimit: 3,
          },
          mocks: [mock(["task1", "task2", "task3", "task4", "task5"])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(screen.queryAllByDataCy("header-cell")).toHaveLength(3);
  });

  it("should truncate the task name only if it is too long", async () => {
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: [longTaskName, "task2"],
          },
          mocks: [mock([longTaskName, "task2"])],
        }),
    });

    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    expect(screen.queryByText(longTaskName)).toBeNull();
    expect(screen.queryByText("task2")).toBeVisible();
  });

  it("should show a tooltip with the full name when hovering over a truncated task name", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <ColumnHeaders
        projectIdentifier="evergreen"
        variantName="some_variant"
      />,
    );
    render(<Component />, {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          state: {
            visibleColumns: [longTaskName],
          },
          mocks: [mock([longTaskName])],
        }),
    });
    await waitFor(() => {
      expect(screen.queryAllByDataCy("loading-header-cell")).toHaveLength(0);
    });
    await user.hover(screen.queryByText(trimmedTaskName));
    await waitFor(() => {
      expect(screen.queryByText(longTaskName)).toBeVisible();
    });
  });
});

const mock = (
  taskNames: TaskNamesForBuildVariantQuery["taskNamesForBuildVariant"],
): ApolloMock<
  TaskNamesForBuildVariantQuery,
  TaskNamesForBuildVariantQueryVariables
> => ({
  request: {
    query: TASK_NAMES_FOR_BUILD_VARIANT,
    variables: {
      projectIdentifier: "evergreen",
      buildVariant: "some_variant",
    },
  },
  result: {
    data: {
      taskNamesForBuildVariant: taskNames,
    },
  },
});
