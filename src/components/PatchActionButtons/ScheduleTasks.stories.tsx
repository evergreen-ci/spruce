import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import WithToastContext from "test_utils/toast-decorator";
import { ScheduleTasks } from ".";

export default {
  title: "Components/Schedule Tasks",
  component: ScheduleTasks,
  decorators: [(story) => WithToastContext(story)],
};

export const ScheduleTasksPopulated = () => (
  <ScheduleTasks versionId="version" />
);

export const ScheduleTasksEmpty = () => (
  <ScheduleTasks versionId="emptyVersion" />
);

ScheduleTasksPopulated.parameters = {
  apolloClient: {
    mocks: [
      {
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
      },
      {
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
      },
    ],
  },
};
