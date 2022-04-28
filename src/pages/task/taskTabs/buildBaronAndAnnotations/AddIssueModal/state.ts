import { useReducer } from "react";
import { useSpruceConfig } from "hooks";
import { validateJiraURL } from "utils/validators";
import { toDecimal } from "./utils";

interface addIssueState {
  url: string;
  issueKey: string;
  canSubmit: boolean;
  isURLValid: boolean;
  isKeyValid: boolean;
  confidenceScore: string | null;
}

type Action =
  | { type: "reset" }
  | { type: "setUrl"; url: string; jiraURL: string }
  | { type: "setKey"; issueKey: string }
  | { type: "setConfidenceScore"; confidenceScore: string | null };

const init = () => ({
  url: "",
  issueKey: "",
  canSubmit: false,
  isURLValid: false,
  isKeyValid: false,
  confidenceScore: null,
});

const reducer = (state: addIssueState, action: Action) => {
  switch (action.type) {
    case "reset":
      return init();
    case "setUrl": {
      const isURLValid = validateJiraURL(action.jiraURL, action.url);
      return {
        ...state,
        url: action.url,
        canSubmit: isURLValid && state.isKeyValid,
        isURLValid,
      };
    }
    case "setKey": {
      const isKeyValid = action.issueKey.length > 0;
      return {
        ...state,
        issueKey: action.issueKey,
        isKeyValid,
        canSubmit: isKeyValid && state.isURLValid,
      };
    }
    case "setConfidenceScore": {
      const isNumber = !Number.isNaN(action.confidenceScore);
      if (isNumber) {
        if (
          toDecimal(action.confidenceScore) <= 1 &&
          toDecimal(action.confidenceScore) >= 0
        ) {
          return {
            ...state,
            confidenceScore: action.confidenceScore,
          };
        }
      }
      return state;
    }
    default:
      throw new Error("Unrecognized action type");
  }
};

export const useAddIssueModal = () => {
  const spruceConfig = useSpruceConfig();
  const [state, dispatch] = useReducer(reducer, init());

  const setUrl = (url: string) => {
    dispatch({ type: "setUrl", url, jiraURL: spruceConfig.jira.host });
  };
  const setKey = (issueKey: string) => {
    dispatch({ type: "setKey", issueKey });
  };
  const setConfidenceScore = (confidenceScore: string | null) => {
    dispatch({ type: "setConfidenceScore", confidenceScore });
  };
  const reset = () => {
    dispatch({ type: "reset" });
  };

  return [state, { setUrl, setKey, setConfidenceScore, reset }] as const;
};
