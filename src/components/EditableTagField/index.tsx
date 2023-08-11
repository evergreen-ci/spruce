import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { size } from "constants/tokens";
import { InstanceTag, ParameterInput } from "gql/generated/types";
import { array } from "utils";
import { TagRow } from "./TagRow";

const { convertArrayToObject } = array;

type Tag = InstanceTag | ParameterInput;
type EditableTagFieldProps = {
  onChange: (data: Tag[]) => void;
  inputTags: Tag[];
  visible?: boolean;
  buttonText: string;
  id?: string;
};

export const EditableTagField: React.FC<EditableTagFieldProps> = ({
  buttonText,
  id,
  inputTags,
  onChange,
  visible,
}) => {
  const [visibleTags, setVisibleTags] = useState(inputTags);
  // Convert this tag array to an object it makes searching through them faster if there are allot of tags
  const visibleTagsAsObject = convertArrayToObject(visibleTags, "key");

  const deleteHandler = (key: string) => {
    const tags = { ...visibleTagsAsObject };
    delete tags[key];
    const tagsBackToArray = Object.values(tags);
    setVisibleTags(tagsBackToArray);
    onChange(tagsBackToArray);
  };

  // tag is the value to replace
  const updateTagHandler = (tag: Tag, deleteKey: string) => {
    const tags = { ...visibleTagsAsObject };
    if (deleteKey) {
      tags[deleteKey] = tag;
    } else {
      tags[tag.key] = tag;
    }
    const tagsBackToArray = Object.values(tags);
    setVisibleTags(tagsBackToArray);
    onChange(tagsBackToArray);
  };

  const validateKey = (key: string) => {
    if (visibleTagsAsObject[key]) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    setVisibleTags(inputTags);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <FlexColumnContainer id={id}>
      {visibleTags.map((tag) => (
        <TagRow
          tag={tag}
          onDelete={deleteHandler}
          key={tag.key}
          onUpdateTag={updateTagHandler}
          isValidKey={validateKey}
          buttonText={buttonText}
        />
      ))}
      <TagRow
        onUpdateTag={updateTagHandler}
        isNewTag
        isValidKey={validateKey}
        buttonText={buttonText}
      />
    </FlexColumnContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${size.xs};
  max-width: 70%;
`;
