import { MockedProvider } from "@apollo/client/testing";
import { screen } from "@testing-library/react";
import { ScheduleTasksModal } from "components/ScheduleTasksModal";
import { SCHEDULE_TASKS } from "gql/mutations";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils/test-utils";
import { ScheduleTasks } from "./ScheduleTasks";

const mockSuccessToast = jest.fn();
const mockErrorToast = jest.fn();
jest.mock("context/toast", () => ({
  useToastContext: () => ({
    success: mockSuccessToast,
    error: mockErrorToast,
  }),
}));

beforeEach(() => {
  mockSuccessToast.mockClear();
  mockErrorToast.mockClear();
});

const SceheduleButton = () => (
  <MockedProvider mocks={[getUnscheduledTasksMock]}>
    <ScheduleTasks versionId="version" />
  </MockedProvider>
);
const ScheduleModal = () => (
  <MockedProvider mocks={[getUnscheduledTasksMock, scheduleTasksMock]}>
    <ScheduleTasksModal open setOpen={() => {}} versionId="version" />
  </MockedProvider>
);

test("Clicking the button opens the modal", async () => {
  const { queryByDataCy } = render(SceheduleButton);
  expect(queryByDataCy("schedule-tasks-modal")).not.toBeInTheDocument();
  await fireEvent.click(queryByDataCy("schedule-tasks-button"));
  await waitFor(() =>
    expect(queryByDataCy("schedule-tasks-modal")).toBeVisible()
  );
});

test("The modal is populated with build variant names and checkboxes", async () => {
  const { queryByText, queryAllByDataCy } = render(ScheduleModal);

  // assert build variant checkbox labels are visibles
  await waitFor(() => expect(queryByText("Windows")).toBeVisible());
  await waitFor(() => expect(queryByText("Ubuntu 16.04")).toBeVisible());

  // open the accordions
  const toggles = queryAllByDataCy("accordion-toggle");
  await fireEvent.click(toggles[0]);
  await fireEvent.click(toggles[1]);

  // assert task checkbox labels are visible
  await waitFor(() => {
    queryAllByDataCy("task-checkbox-label").forEach((label) => {
      expect(label).toBeVisible();
    });
  });
});

test("Selecting some and not all task checkboxes puts the build variant checkbox in an indeterminate state.", async () => {
  const { queryByText, queryAllByDataCy, queryByDataCy } = render(
    ScheduleModal
  );
  await waitFor(() => expect(queryByText("Windows")).toBeVisible());
  const toggles = queryAllByDataCy("accordion-toggle");
  await fireEvent.click(toggles[1]);
  await waitFor(() => {
    expect(
      queryByDataCy("windows-variant-checkbox").getAttribute("aria-checked")
    ).toBe("false");
  });
  await fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
  await waitFor(() => {
    expect(
      queryByDataCy("windows-variant-checkbox").getAttribute("aria-checked")
    ).toBe("mixed");
  });
});

test("Schedule button is disabled until at least one checkbox is selected", async () => {
  const { queryByText, queryAllByDataCy, queryByDataCy } = render(
    ScheduleModal
  );
  await waitFor(() => expect(queryByText("Windows")).toBeVisible());
  const toggles = queryAllByDataCy("accordion-toggle");
  await fireEvent.click(toggles[1]);
  await waitFor(() => {
    // Unable to pass data-cy to modal buttons so we have to use getAllByRole
    const confirmButton = screen.getAllByRole("button")[0];
    expect(confirmButton).toBeDisabled();
  });
  await fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
  await waitFor(() => {
    const confirmButton = screen.getAllByRole("button")[0];
    expect(confirmButton).not.toBeDisabled();
  });
});

test("Clicking on schedule button dispatches a properly formatted request and dispatches a toast", async () => {
  const { queryByText, queryAllByDataCy, queryByDataCy } = render(
    ScheduleModal
  );
  await waitFor(() => expect(queryByText("Windows")).toBeVisible());
  const windowVariantToggle = queryAllByDataCy("accordion-toggle")[1];
  await fireEvent.click(windowVariantToggle);
  await fireEvent.click(queryByDataCy("windows-compile-task-checkbox"));
  const confirmButton = screen.getAllByRole("button")[0];
  await fireEvent.click(confirmButton);
  await waitFor(() => expect(mockErrorToast).toHaveBeenCalledTimes(0));
  await waitFor(() => expect(mockSuccessToast).toHaveBeenCalledTimes(1));
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
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "coverage",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "e2e_test",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "lint",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "storybook",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "test",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_ubuntu1604_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "type_check",
            buildVariant: "ubuntu1604",
            buildVariantDisplayName: "Ubuntu 16.04",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_compile_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "compile",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "coverage",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "e2e_test",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "lint",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "storybook",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "test",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
          {
            id:
              "spruce_windows_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
            displayName: "type_check",
            buildVariant: "windows",
            buildVariantDisplayName: "Windows",
            __typename: "Task",
          },
        ],
        __typename: "PatchTasks",
      },
    },
  },
};
