import React, { useState } from "react";
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
export const EditableTagFieldView = () => {
  const [state, setState] = useState([]);
  console.log({ state });
  return (
    <EditableTagField
      inputTags={instanceTags}
      onChange={setState}
      buttonText="Add Tag"
    />
  );
};

export default {
  title: "Editable Tags Field",
};
