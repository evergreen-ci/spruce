import { MockedProvider } from "@apollo/client/testing";
import { screen } from "@testing-library/react";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { SCHEDULE_TASKS } from "gql/mutations";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import { render, fireEvent, waitFor, renderWithRouterMatch } from "test_utils";
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
    const { queryByDataCy } = renderWithRouterMatch(Component);
    expect(queryByDataCy("schedule-tasks-modal")).not.toBeInTheDocument();
    fireEvent.click(queryByDataCy("schedule-patch"));
    await waitFor(() =>
      expect(queryByDataCy("schedule-tasks-modal")).toBeVisible()
    );
  });

  it("the modal is populated with build variant names and checkboxes", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    const { queryByText, queryAllByDataCy } = render(<Component />);

    // assert build variant checkbox labels are visible
    await waitFor(() => expect(queryByText("Windows")).toBeVisible());
    await waitFor(() => expect(queryByText("Ubuntu 16.04")).toBeVisible());

    // open the accordions
    const toggles = queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[0]);
    fireEvent.click(toggles[1]);

    // assert task checkbox labels are visible
    await waitFor(() => {
      queryAllByDataCy("task-checkbox-label").forEach((label) => {
        expect(label).toBeVisible();
      });
    });
  });

  it("selecting some and not all task checkboxes puts the build variant checkbox in an indeterminate state.", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    const { queryByText, queryAllByDataCy, queryByDataCy } = render(
      <Component />
    );
    await waitFor(() => expect(queryByText("Windows")).toBeVisible());
    const toggles = queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[1]);
    await waitFor(() => {
      expect(
        queryByDataCy("windows-variant-checkbox").getAttribute("aria-checked")
      ).toBe("false");
    });
    fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
    await waitFor(() => {
      expect(
        queryByDataCy("windows-variant-checkbox").getAttribute("aria-checked")
      ).toBe("mixed");
    });
  });
  it("schedule button is disabled until at least one checkbox is selected", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModal />);

    const { queryByText, queryAllByDataCy, queryByDataCy } = render(
      <Component />
    );
    await waitFor(() => expect(queryByText("Windows")).toBeVisible());
    const toggles = queryAllByDataCy("accordion-toggle");
    fireEvent.click(toggles[1]);
    fireEvent.click(queryByDataCy("windows-compile-task-checkbox")); // deselect checkbox from previous test
    await waitFor(() => {
      // Unable to pass data-cy to modal buttons so we have to use getAllByRole
      const confirmButton = screen.getAllByRole("button")[0];
      expect(confirmButton).toBeDisabled();
    });
    fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
    await waitFor(() => {
      const confirmButton = screen.getAllByRole("button")[0];
      expect(confirmButton).not.toBeDisabled();
    });
  });
  it("clicking on schedule button dispatches a properly formatted request and dispatches a toast", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(
      <ScheduleModal />
    );

    const { queryByText, queryAllByDataCy, queryByDataCy } = render(
      <Component />
    );
    await waitFor(() => expect(queryByText("Windows")).toBeVisible());
    const windowVariantToggle = queryAllByDataCy("accordion-toggle")[1];
    fireEvent.click(windowVariantToggle);
    fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
    const confirmButton = screen.getAllByRole("button")[0];
    fireEvent.click(confirmButton);

    expect(dispatchToast.error).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Tasks scheduled successfully"
      );
    });
  });

  it("modal displays copy when there are no schedulable tasks.", async () => {
    const { Component } = RenderFakeToastContext(<ScheduleModalEmpty />);

    const { queryByText } = render(<Component />);
    await waitFor(() =>
      expect(queryByText("There are no schedulable tasks.")).toBeVisible()
    );
  });
});

const scheduleTasksMock = {
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
      id: "1",
      execution: 3,
      buildVariant: "windows",
      displayName: "compile",
      revision: "abcb",
      status: "will-run",
    },
  },
};

const getUnscheduledTasksMock = {
  request: {
    query: GET_UNSCHEDULED_TASKS,
    variables: { versionId: "version" },
  },
  result: {
    data: {
      patchTasks: {
        tasks: [
          {
            id:
              "spruce_ubuntu1604_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "compile",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "coverage",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 2,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "e2e_test",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "lint",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "storybook",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "test",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "type_check",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "compile",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "coverage",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "e2e_test",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "lint",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "storybook",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "test",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "type_check",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            execution: 1,
            __typename: "Task",
          },
        ],
        __typename: "PatchTasks",
      },
    },
  },
};
const getUnscheduledTasksMockEmpty = {
  request: {
    query: GET_UNSCHEDULED_TASKS,
    variables: { versionId: "emptyVersion" },
  },
  result: {
    data: {
      patchTasks: {
        tasks: [],
        __typename: "PatchTasks",
      },
    },
  },
};
