import { ParameterInput, InstanceTag } from "gql/generated/types";

type Tag = InstanceTag | ParameterInput;

type State = {
  key: string;
  value: string;
  canSave: boolean;
  isInputValid: boolean;
  shouldShowNewTag: boolean;
};
type Action =
  | { type: "newTag" }
  | { type: "updateTag"; key?: string; value?: string }
  | {
      type: "inActive";
    }
  | {
      type: "cancelNewTag";
    };

export const getInitialState = (tag: Tag, isNewTag: boolean) => ({
  canSave: false,
  isInputValid: true,
  key: tag ? tag.key : "",
  shouldShowNewTag: !isNewTag,
  value: tag ? tag.value : "",
});

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "newTag":
      return {
        ...state,
        canSave: false,
        key: "",
        shouldShowNewTag: true,
        value: "",
      };
    case "updateTag": {
      const { type, ...a } = action;
      const update = { ...state, ...a };
      const canSave =
        (action.key && state.value !== "") ||
        (action.value && state.key !== "");
      return {
        ...update,
        canSave,
        isInputValid: canSave,
      };
    }
    case "inActive":
      return { ...state, canSave: false };
    case "cancelNewTag":
      return getInitialState(undefined, true);
    default:
      throw new Error("Unknown action type");
  }
};
