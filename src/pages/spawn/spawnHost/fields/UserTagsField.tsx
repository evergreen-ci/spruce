import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { InstanceTag } from "gql/generated/types";
import { convertArrayToObject } from "utils/array";
import { UserTagRow } from "./userTagsField/UserTagRow";

export interface UserTagsFieldStateType {
  addedInstanceTags?: InstanceTag[];
  deletedInstanceTags?: InstanceTag[];
}

interface UserTagsFieldProps {
  data: UserTagsFieldStateType;
  onChange: React.Dispatch<React.SetStateAction<any>>;
  instanceTags: InstanceTag[];
}
export const UserTagsField: React.FC<UserTagsFieldProps> = ({
  data,
  onChange,
  instanceTags,
}) => {
  const userTags = instanceTags.filter((tag) => tag.canBeModified);
  const [visibleTags, setVisibleTags] = useState(userTags);
  // Convert this tag array to an object it makes searching through them faster if there are allot of tags
  const visibleTagsAsObject = convertArrayToObject(visibleTags, "key");
  const userTagsAsObject = convertArrayToObject(userTags, "key");

  useEffect(() => {
    const deletedTags: string[] = [];
    const addedTags: InstanceTag[] = [];
    // anything thats in user tags but not in visible tags has been deleted
    userTags.forEach((tag) => {
      if (!visibleTagsAsObject[tag.key]) {
        deletedTags.push(tag.key);
      }
    });
    // anything thats in visible tags but not in user tags is new
    visibleTags.forEach((tag) => {
      if (!userTagsAsObject[tag.key]) {
        addedTags.push(tag);
        // If a tag exists but its value has change we add it to added tags
      } else if (userTagsAsObject[tag.key].value !== tag.value) {
        addedTags.push(tag);
      }
    });
    onChange({
      ...data,
      deletedInstanceTags: deletedTags,
      addedInstanceTags: addedTags,
    });
  }, [visibleTags]); // eslint-disable-line react-hooks/exhaustive-deps

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
      <UserTagRow onUpdateTag={updateTagHandler} isNewTag />
      {visibleTags.map((tag) => (
        <UserTagRow
          tag={tag}
          onDelete={deleteHandler}
          key={tag.key}
          onUpdateTag={updateTagHandler}
        />
      ))}
    </FlexColumnContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
