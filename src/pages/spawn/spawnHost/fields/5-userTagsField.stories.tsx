import React, { useState } from "react";
import { InstanceTag } from "gql/generated/types";
import { UserTagsField, UserTagsFieldStateType } from "./UserTagsField";
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
export const PublicKeyFormView = () => {
  const [state, setState] = useState<UserTagsFieldStateType>({
    addedInstanceTags: [],
    deletedInstanceTags: [],
  });
  console.log({ state });
  return <UserTagsField instanceTags={instanceTags} onChange={setState} />;
};

export default {
  title: "User Tags Field",
};
