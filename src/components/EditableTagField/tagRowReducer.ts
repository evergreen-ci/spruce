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
  key: tag ? tag.key : "",
  value: tag ? tag.value : "",
  canSave: false,
  isInputValid: true,
  shouldShowNewTag: !isNewTag,
});

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "newTag":
      return {
        ...state,
        key: "",
        value: "",
        canSave: false,
        shouldShowNewTag: true,
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
