import { MockedProvider } from "@apollo/client/testing";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
} from "gql/generated/types";
import { SCHEDULE_TASKS } from "gql/mutations";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import {
  fireEvent,
  render,
  renderWithRouterMatch,
  screen,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { ScheduleTasks } from "./ScheduleTasks";

const ScheduleButton = () => (
  <MockedProvider mocks={[getUnscheduledTasksMock]}>
    <ScheduleTasks versionId="version" isButton />
  </MockedProvider>
);

const ScheduleModal = () => (
  <MockedProvider mocks={[getUnscheduledTasksMock, scheduleTasksMock]}>
    <ScheduleTasksModal open setOpen={() => {}} versionId="version" />
  </MockedProvider>
);

const ScheduleModalEmpty = () => (
  <MockedProvider mocks={[getUnscheduledTasksMockEmpty]}>
    <ScheduleTasksModal open setOpen={() => {}} versionId="emptyVersion" />
  </MockedProvider>
);

describe("scheduleTasks", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("clicking the button opens the modal", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleButton />);
    renderWithRouterMatch(<Component />);
    expect(
      screen.queryByDataCy("schedule-tasks-modal")
    ).not.toBeInTheDocument();
    fireEvent.click(screen.queryByDataCy("schedule-patch"));
    await waitFor(() =>
      expect(screen.queryByDataCy("schedule-tasks-modal")).toBeVisible()
    );
  });

  it("selecting some and not all task checkboxes puts the build variant checkbox in an indeterminate state.", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    render(<Component />);
    await waitFor(() => expect(screen.queryByText("Windows")).toBeVisible());
    const toggles = screen.queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[1]);
    await waitFor(() => {
      expect(
        screen
          .queryByDataCy("windows-variant-checkbox")
          .getAttribute("aria-checked")
      ).toBe("false");
    });
    fireEvent.click(screen.queryByDataCy("windows-compile-task-checkbox"));
    await waitFor(() => {
      expect(
        screen
          .queryByDataCy("windows-variant-checkbox")
          .getAttribute("aria-checked")
      ).toBe("mixed");
    });
  });

  it("the modal is populated with build variant names and checkboxes", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    render(<Component />);

    // assert build variant checkbox labels are visible
    await waitFor(() => expect(screen.queryByText("Windows")).toBeVisible());
    await waitFor(() =>
      expect(screen.queryByText("Ubuntu 16.04")).toBeVisible()
    );

    // open the accordions
    const toggles = screen.queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);

    // assert task checkbox labels are visible
    screen.queryAllByDataCy("task-checkbox-label").forEach((label) => {
      expect(label).toBeVisible();
    });
  });

  it("schedule button is disabled until at least one checkbox is selected", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    render(<Component />);
    await waitFor(() => expect(screen.queryByText("Windows")).toBeVisible());
    const toggles = screen.queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[1]);
    fireEvent.click(screen.queryByDataCy("windows-compile-task-checkbox")); // deselect checkbox from previous test
    await waitFor(() => {
      // Unable to pass data-cy to modal buttons so we have to use getAllByRole
      const confirmButton = screen.getAllByRole("button")[0];
      expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    });
    fireEvent.click(screen.queryByDataCy("windows-compile-task-checkbox"));
    await waitFor(() => {
      const confirmButton = screen.getAllByRole("button")[0];
      expect(confirmButton).not.toHaveAttribute("aria-disabled", "true");
    });
  });

  it("clicking on schedule button dispatches a properly formatted request and dispatches a toast", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <ScheduleModal />
    );

    render(<Component />);
    await waitFor(() => expect(screen.queryByText("Windows")).toBeVisible());
    const windowVariantToggle = screen.queryAllByDataCy("accordion-toggle")[1];
    fireEvent.click(windowVariantToggle);
    fireEvent.click(screen.queryByDataCy("windows-compile-task-checkbox"));
    const confirmButton = screen.getAllByRole("button")[0];
    fireEvent.click(confirmButton);

    expect(dispatchToast.error).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Successfully scheduled tasks!"
      );
    });
  });

  it("modal displays copy when there are no schedulable tasks.", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModalEmpty />);

    render(<Component />);
    await waitFor(() =>
      expect(
        screen.queryByText("There are no schedulable tasks.")
      ).toBeVisible()
    );
  });
});

const scheduleTasksMock: ApolloMock<
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables
> = {
  request: {
    query: SCHEDULE_TASKS,
    variables: {
      taskIds: [
        "spruce_windows_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
      ],
    },
  },
  result: {
    data: {
      scheduleTasks: [
        {
          id: "1",
          execution: 3,
          buildVariant: "windows",
          displayName: "compile",
          revision: "abcb",
          status: "will-run",
        },
      ],
    },
  },
};

const getUnscheduledTasksMock: ApolloMock<
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables
> = {
  request: {
    query: GET_UNSCHEDULED_TASKS,
    variables: { versionId: "version" },
  },
  result: {
    data: {
      version: {
        tasks: {
          data: [
            {
              id: "spruce_ubuntu1604_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "compile",
              execution: 1,
            },
            {
              id: "spruce_ubuntu1604_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "coverage",
              execution: 2,
            },
            {
              id: "spruce_ubuntu1604_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "e2e_test",
              execution: 1,
            },
            {
              id: "spruce_ubuntu1604_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "lint",
              execution: 1,
            },
            {
              id: "spruce_ubuntu1604_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "storybook",
              execution: 1,
            },
            {
              id: "spruce_ubuntu1604_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "test",
              execution: 1,
            },
            {
              id: "spruce_ubuntu1604_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "ubuntu1604",
              buildVariantDisplayName: "Ubuntu 16.04",
              displayName: "type_check",
              execution: 1,
            },
            {
              id: "spruce_windows_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "compile",
              execution: 1,
            },
            {
              id: "spruce_windows_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "coverage",
              execution: 1,
            },
            {
              id: "spruce_windows_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "e2e_test",
              execution: 1,
            },
            {
              id: "spruce_windows_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "lint",
              execution: 1,
            },
            {
              id: "spruce_windows_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "storybook",
              execution: 1,
            },
            {
              id: "spruce_windows_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "test",
              execution: 1,
            },
            {
              id: "spruce_windows_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
              buildVariant: "windows",
              buildVariantDisplayName: "Windows",
              displayName: "type_check",
              execution: 1,
            },
          ],
        },
      },
    },
  },
};
const getUnscheduledTasksMockEmpty: ApolloMock<
  GetUndispatchedTasksQuery,
  GetUndispatchedTasksQueryVariables
> = {
  request: {
    query: GET_UNSCHEDULED_TASKS,
    variables: { versionId: "emptyVersion" },
  },
  result: {
    data: {
      version: {
        tasks: {
          data: [],
        },
      },
    },
  },
};
