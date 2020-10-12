import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { InstanceTag, InstanceTagInput } from "gql/generated/types";
import { convertArrayToObject } from "utils/array";
import { UserTagRow } from "./userTagsField/UserTagRow";

export interface UserTagsFieldStateType {
  addedInstanceTags?: InstanceTagInput[];
  deletedInstanceTags?: InstanceTagInput[];
}

interface UserTagsFieldProps {
  onChange: React.Dispatch<React.SetStateAction<any>>;
  instanceTags: InstanceTag[];
  visible?: boolean;
}
export const UserTagsField: React.FC<UserTagsFieldProps> = ({
  onChange,
  instanceTags,
  visible = true,
}) => {
  const userTags = instanceTags?.filter((tag) => tag.canBeModified);
  const [visibleTags, setVisibleTags] = useState(userTags);
  // Convert this tag array to an object it makes searching through them faster if there are allot of tags
  const visibleTagsAsObject = convertArrayToObject(visibleTags, "key");
  const userTagsAsObject = convertArrayToObject(userTags, "key");

  useEffect(() => {
    const deletedTags: InstanceTagInput[] = [];
    const addedTags: InstanceTagInput[] = [];
    // anything thats in user tags but not in visible tags has been deleted
    userTags.forEach((tag) => {
      if (!visibleTagsAsObject[tag.key]) {
        const { key, value } = tag;
        deletedTags.push({ key, value });
      }
    });
    // anything thats in visible tags but not in user tags is new
    visibleTags.forEach((tag) => {
      if (!userTagsAsObject[tag.key]) {
        const { key, value } = tag;
        addedTags.push({ key, value });
        // If a tag exists but its value has change we add it to added tags
      } else if (userTagsAsObject[tag.key].value !== tag.value) {
        const { key, value } = tag;
        addedTags.push({ key, value });
      }
    });
    onChange({
      deletedInstanceTags: deletedTags,
      addedInstanceTags: addedTags,
    });
  }, [visibleTags]); // eslint-disable-line react-hooks/exhaustive-deps

  // used to reset the user tags when we close the modal
  useEffect(() => {
    setVisibleTags(userTags);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteHandler = (key: string) => {
    if (visibleTagsAsObject[key]) {
      delete visibleTagsAsObject[key];
    }
    setVisibleTags(Object.values(visibleTagsAsObject));
  };

  const updateTagHandler = (tag: InstanceTag, deleteKey?: string) => {
    if (deleteKey) {
      delete visibleTagsAsObject[deleteKey];
    }
    visibleTagsAsObject[tag.key] = tag;
    setVisibleTags(Object.values(visibleTagsAsObject));
  };

  return (
    <FlexColumnContainer>
      {visibleTags.map((tag) => (
        <UserTagRow
          tag={tag}
          onDelete={deleteHandler}
          key={tag.key}
          onUpdateTag={updateTagHandler}
          resetRow={visible}
        />
      ))}
      <UserTagRow onUpdateTag={updateTagHandler} isNewTag resetRow={visible} />
    </FlexColumnContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
