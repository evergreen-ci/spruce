import { action } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { EditableTagField } from "./index";

export default {
  component: EditableTagField,
};

export const Default: StoryObj<typeof EditableTagField> = {
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
