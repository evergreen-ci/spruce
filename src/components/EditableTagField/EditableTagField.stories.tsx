import { action } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { EditableTagField } from "./index";

export default {
  component: EditableTagField,
} satisfies CustomMeta<typeof EditableTagField>;

export const Default: CustomStoryObj<typeof EditableTagField> = {
  render: () => (
    <EditableTagField
      inputTags={instanceTags}
      onChange={action("Change Tag")}
      buttonText="Add Tag"
    />
  ),
};

const instanceTags = [
  { key: "keyA", value: "valueA" },
  {
    key: "keyB",
    value: "valueB",
  },
  {
    key: "keyC",
    value: "valueC",
  },
];
