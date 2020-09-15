import React, { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Input } from "antd";
import { v4 as uuid } from "uuid";
import Icon from "components/icons/Icon";
import { PlusButton } from "components/Spawn";
import { InputLabel } from "components/styles";
import { InstanceTag } from "gql/generated/types";

interface UserTagRowProps {
  tag?: InstanceTag;
  onDelete?: (key: string) => void;
  onUpdateTag?: (tag: InstanceTag, deleteKey?: string) => void;
  isNewTag?: boolean;
}
export const UserTagRow: React.FC<UserTagRowProps> = ({
  tag,
  onDelete,
  onUpdateTag,
  isNewTag = false,
}) => {
  const [key, setKey] = useState(tag?.key);
  const [value, setValue] = useState(tag?.value);
  const [hasEditedTag, setHasEditedTag] = useState(false);
  const [createNewTag, setCreateNewTag] = useState(false);

  const tagId = uuid();
  const updateKey = (k) => {
    setHasEditedTag(true);
    setKey(k);
  };
  const updateValue = (v) => {
    setHasEditedTag(true);
    setValue(v);
  };

  const updateTag = () => {
    if (tag?.key !== key) {
      onUpdateTag({ key, value }, tag?.key);
    } else {
      onUpdateTag({ key, value });
    }
    setHasEditedTag(false);
  };
  const createNewTagHandler = () => {
    onUpdateTag({ key, value });
    setCreateNewTag(false);
    setKey("");
    setValue("");
  };

  const shouldShowTagInput = createNewTag || !isNewTag;
  return (
    <FlexColumnContainer>
      {shouldShowTagInput && (
        <FlexContainer>
          <FlexColumnContainer>
            <Section>
              <InputLabel htmlFor={`tag_key_${tagId}`}>Key</InputLabel>
              <Input
                id={`tag_key_${tagId}`}
                value={key}
                onChange={(e) => updateKey(e.target.value)}
              />
            </Section>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <Section>
              <InputLabel htmlFor={`tag_value_${tagId}`}>Value</InputLabel>
              <Input
                id={`tag_value_${tagId}`}
                value={value}
                onChange={(e) => updateValue(e.target.value)}
              />
            </Section>
          </FlexColumnContainer>

          <IconButtonContainer>
            {hasEditedTag ? (
              <IconButton variant="light" aria-label="Edit Tag">
                <Icon
                  glyph="Edit"
                  onClick={isNewTag ? createNewTagHandler : updateTag}
                />
              </IconButton>
            ) : (
              <IconButton variant="light" aria-label="Delete Tag">
                <Icon
                  glyph="Trash"
                  onClick={
                    isNewTag
                      ? () => setCreateNewTag(false)
                      : () => onDelete(tag.key)
                  }
                />
              </IconButton>
            )}
          </IconButtonContainer>
        </FlexContainer>
      )}
      {!shouldShowTagInput && (
        <ButtonContainer>
          <PlusButton
            disabled={createNewTag}
            onClick={() => setCreateNewTag(!createNewTag)}
          >
            Add Tag
          </PlusButton>
        </ButtonContainer>
      )}
    </FlexColumnContainer>
  );
};

const ButtonContainer = styled.div`
  margin-top: 25px;
`;
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;

const Section = styled(FlexColumnContainer)`
  margin-top: 20px;
`;

const IconButtonContainer = styled.div`
  margin-top: 42px;
`;
