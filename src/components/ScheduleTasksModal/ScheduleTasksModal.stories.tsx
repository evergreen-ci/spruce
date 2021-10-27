import StoryRouter from "storybook-react-router";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import WithToastContext from "test_utils/toast-decorator";
import { ScheduleTasksModal } from ".";

export default {
  title: "ScheduleTasksModal",
  component: ScheduleTasksModal,
  decorators: [StoryRouter(), (story) => WithToastContext(story)],
};

export const Story = () => <ScheduleTasksModal open versionId="version" />;

Story.parameters = {
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
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "compile",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_compile_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_coverage_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "coverage",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_coverage_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_e2e_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "e2e_test",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_e2e_test_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_lint_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 1,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "lint",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_lint_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_storybook_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "storybook",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_storybook_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_test_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "test",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_test_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
                {
                  id:
                    "spruce_ubuntu1604_type_check_patch_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_615b40869ccd4e6af36a20ad_21_10_04_17_57_32",
                  execution: 0,
                  aborted: false,
                  status: "undscheduled",
                  displayName: "type_check",
                  buildVariant: "ubuntu1604",
                  buildVariantDisplayName: "Ubuntu 16.04",
                  blocked: false,
                  executionTasksFull: null,
                  baseTask: {
                    id:
                      "spruce_ubuntu1604_type_check_32ce975c828926b398d9ba0cac1b287b2d6aaa5e_21_09_10_20_06_43",
                    execution: 0,
                    status: "undscheduled",
                    __typename: "Task",
                  },
                  __typename: "Task",
                },
              ],
              __typename: "PatchTasks",
            },
          },
        },
      },
    ],
  },
};
