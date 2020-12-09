import React, { useState } from "react";
import { InstanceTag } from "gql/generated/types";
import { UserTagsField, UserTagsData } from "./UserTagsField";
import "antd/es/select/style/css";
import "antd/es/carousel/style/css";

const instanceTags: InstanceTag[] = [
  { key: "keyA", value: "valueA", canBeModified: true },
  {
    key: "keyB",
    value: "valueB",
    canBeModified: true,
  },
  {
    key: "keyC",
    value: "valueC",
    canBeModified: true,
  },
  {
    key: "hiddenField",
    value: "idk",
    canBeModified: false,
  },
];
export const UserTagsFieldView = () => {
  const [state, setState] = useState<UserTagsData>({
    addedInstanceTags: [],
    deletedInstanceTags: [],
  });
  console.log({ state });
  return <UserTagsField instanceTags={instanceTags} onChange={setState} />;
};

export default {
  title: "User Tags Field",
};
