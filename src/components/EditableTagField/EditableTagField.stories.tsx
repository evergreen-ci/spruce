import React from "react";
import { action } from "@storybook/addon-actions";
import { EditableTagField } from "./index";

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
export const EditableTagFieldView = () => (
  <EditableTagField
    inputTags={instanceTags}
    onChange={action("Change Tag")}
    buttonText="Add Tag"
  />
);

export default {
  title: "Editable Tags Field",
};
