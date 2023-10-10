import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { ParametersModal } from ".";

export default {
  component: ParametersModal,
} satisfies CustomMeta<typeof ParametersModal>;

export const Default: CustomStoryObj<typeof ParametersModal> = {
  render: (args) => (
    <ParametersModal
      {...args}
      parameters={[
        { key: "project_name", value: "evergreen" },
        { key: "should_generate_tasks", value: "true" },
        { key: "reuse_commit_hash", value: "12345678910acbde" },
        { key: "downstream_project_name", value: "spruce" },
      ]}
    />
  ),
};
