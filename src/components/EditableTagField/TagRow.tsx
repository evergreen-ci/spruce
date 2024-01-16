import { useReducer, useMemo } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import TextInput from "@leafygreen-ui/text-input";
import { PlusButton } from "components/Buttons";
import Icon from "components/Icon";
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
export const TagRow: React.FC<TagRowProps> = ({
  buttonText,
  isNewTag = false,
  isValidKey,
  onDelete,
  onUpdateTag,
  tag,
}) => {
  const [state, dispatch] = useReducer(reducer, getInitialState(tag, isNewTag));

  const tagId = useMemo(() => crypto.randomUUID(), []);
  const { canSave, isInputValid, key, shouldShowNewTag, value } = state;

  return (
    <FlexColumnContainer
      data-cy={!shouldShowNewTag ? "add-tag-button-row" : "user-tag-row"}
    >
      {shouldShowNewTag && (
        <FlexContainer>
          <FlexColumnContainer>
            <Section>
              <TextInput
                label="Key"
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
              <TextInput
                label="Value"
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
                      !isNewTag && key !== tag.key ? tag.key : undefined,
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
  align-items: flex-end;
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
  margin-bottom: ${size.xxs};
`;
