import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import {
  UndispatchedTasksQuery,
  UndispatchedTasksQueryVariables,
} from "gql/generated/types";
import { GET_UNSCHEDULED_TASKS } from "gql/queries";
import WithToastContext from "test_utils/toast-decorator";
import { ApolloMock } from "types/gql";
import { ScheduleTasks } from ".";

export default {
  component: ScheduleTasks,
  decorators: [
    (Story: () => JSX.Element) => WithToastContext(Story),
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={mocks}>
        <Story />
      </MockedProvider>
    ),
  ],
};

export const ScheduleTasksPopulated: StoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="version" />,
};

export const ScheduleTasksEmpty: StoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="emptyVersion" />,
};

const mocks: ApolloMock<
  UndispatchedTasksQuery,
  UndispatchedTasksQueryVariables
>[] = [
  {
    request: {
      query: GET_UNSCHEDULED_TASKS,
      variables: { versionId: "version" },
    },
    result: {
      data: {
        version: {
          id: "version_id",
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
  },
  {
    request: {
      query: GET_UNSCHEDULED_TASKS,
      variables: { versionId: "emptyVersion" },
    },
    result: {
      data: {
        version: {
          id: "version_empty",
          tasks: {
            data: [],
          },
        },
      },
    },
  },
];
