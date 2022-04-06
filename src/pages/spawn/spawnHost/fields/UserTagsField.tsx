import React from "react";
import { EditableTagField } from "components/EditableTagField";
import { InstanceTag, InstanceTagInput } from "gql/generated/types";
import { array } from "utils";

const { convertArrayToObject } = array;

export type UserTagsData = {
  deletedInstanceTags: InstanceTagInput[];
  addedInstanceTags: InstanceTagInput[];
};
interface UserTagsFieldProps {
  onChange: (data: UserTagsData) => void;
  instanceTags: InstanceTag[];
  visible?: boolean;
}

export const UserTagsField: React.VFC<UserTagsFieldProps> = ({
  onChange,
  instanceTags,
  visible = true,
}) => {
  const userTags = instanceTags?.filter((tag) => tag.canBeModified);
  const userTagsAsObject = convertArrayToObject(userTags, "key");

  const onUpdateTags = (tags) => {
    const inputTagsAsObject = convertArrayToObject(tags, "key");
    const deletedTags: InstanceTagInput[] = [];
    const addedTags: InstanceTagInput[] = [];

    tags.forEach((tag) => {
      if (!userTagsAsObject[tag.key]) {
        addedTags.push({ key: tag.key, value: tag.value });
      } else if (userTagsAsObject[tag.key].value !== tag.value) {
        addedTags.push({ key: tag.key, value: tag.value });
      }
    });
    userTags.forEach((tag) => {
      if (!inputTagsAsObject[tag.key]) {
        deletedTags.push({ key: tag.key, value: tag.value });
      }
    });
    onChange({
      deletedInstanceTags: deletedTags,
      addedInstanceTags: addedTags,
    });
  };
  return (
    <EditableTagField
      inputTags={userTags}
      onChange={onUpdateTags}
      visible={visible}
      buttonText="Add Tag"
    />
  );
};
