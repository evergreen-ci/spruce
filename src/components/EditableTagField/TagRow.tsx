import { useReducer, useMemo } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Input } from "antd";
import { v4 as uuid } from "uuid";
import Icon from "components/Icon";
import { PlusButton } from "components/Spawn";
import { InputLabel } from "components/styles";
import { size } from "constants/tokens";
import { ParameterInput, InstanceTag } from "gql/generated/types";
import { reducer, getInitialState } from "./tagRowReducer";

type Tag = InstanceTag | ParameterInput;

interface TagRowProps {
  tag?: Tag;
  onDelete?: (key: string) => void;
  onUpdateTag?: (tag: Tag, deleteKey?: string) => void;
  isValidKey: (key: string) => boolean; // function to validate if a key has been duplicated
  isNewTag?: boolean;
  buttonText: string;
}
export const TagRow: React.VFC<TagRowProps> = ({
  tag,
  onDelete,
  onUpdateTag,
  isValidKey,
  isNewTag = false,
  buttonText,
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(tag, isNewTag));

  const tagId = useMemo(() => uuid(), []);
  const { key, value, canSave, isInputValid, shouldShowNewTag } = state;

  return (
    <FlexColumnContainer
      data-cy={!shouldShowNewTag ? "add-tag-button-row" : "user-tag-row"}
    >
      {shouldShowNewTag && (
        <FlexContainer>
          <FlexColumnContainer>
            <Section>
              <InputLabel htmlFor={`tag_key_${tagId}`}>Key</InputLabel>
              <Input
                id={`tag_key_${tagId}`}
                value={key}
                onChange={(e) =>
                  dispatch({ type: "updateTag", key: e.target.value })
                }
                data-cy="user-tag-key-field"
              />
            </Section>
          </FlexColumnContainer>
          <FlexColumnContainer>
            <Section>
              <InputLabel htmlFor={`tag_value_${tagId}`}>Value</InputLabel>
              <Input
                id={`tag_value_${tagId}`}
                value={value}
                onChange={(e) =>
                  dispatch({ type: "updateTag", value: e.target.value })
                }
                data-cy="user-tag-value-field"
              />
            </Section>
          </FlexColumnContainer>
          <IconButtonContainer>
            {canSave ? (
              <IconButton
                aria-label="Update tag"
                disabled={
                  !isInputValid ||
                  ((isNewTag || key !== tag.key) && !isValidKey(key))
                }
              >
                <Icon
                  glyph="Checkmark"
                  data-cy="user-tag-edit-icon"
                  onClick={() => {
                    dispatch({
                      type: isNewTag ? "cancelNewTag" : "inActive",
                    });
                    onUpdateTag(
                      { key, value },
                      !isNewTag && key !== tag.key ? tag.key : undefined
                    );
                  }}
                />
              </IconButton>
            ) : (
              <IconButton aria-label="Delete Tag">
                <Icon
                  glyph="Trash"
                  onClick={
                    isNewTag
                      ? () => dispatch({ type: "cancelNewTag" })
                      : () => onDelete(tag.key)
                  }
                  data-cy="user-tag-trash-icon"
                />
              </IconButton>
            )}
          </IconButtonContainer>
        </FlexContainer>
      )}
      {!shouldShowNewTag && (
        <ButtonContainer>
          <PlusButton
            onClick={() => dispatch({ type: "newTag" })}
            data-cy="add-tag-button"
          >
            {buttonText}
          </PlusButton>
        </ButtonContainer>
      )}
    </FlexColumnContainer>
  );
};

const ButtonContainer = styled.div`
  margin-top: ${size.m};
`;
const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: ${size.xs};
`;

const Section = styled(FlexColumnContainer)`
  margin-top: ${size.m};
`;

const IconButtonContainer = styled.div`
  margin-top: ${size.l};
`;
