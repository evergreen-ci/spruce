import { useReducer } from "react";

interface AddIssueState {
  url: string;
  issueKey: string;
  canSubmit: boolean;
  isURLValid: boolean; // Will be used in https://jira.mongodb.org/browse/EVG-16842
  isKeyValid: boolean;
  isConfidenceScoreValid: boolean;
  confidenceScore: string;
}

type Action =
  | { type: "reset" }
  | { type: "setUrl"; url: string }
  | { type: "setKey"; issueKey: string }
  | { type: "setConfidenceScore"; confidenceScore: string };

const init = (): AddIssueState => ({
  url: "",
  issueKey: "",
  canSubmit: false,
  isURLValid: true,
  isKeyValid: true,
  isConfidenceScoreValid: true,
  confidenceScore: null,
});

const reducer = (state: AddIssueState, action: Action) => {
  switch (action.type) {
    case "reset":
      return init();
    case "setUrl": {
      const isURLValid = action.url !== null && action.url.length > 0;
      return {
        ...state,
        url: action.url,
        canSubmit:
          isURLValid && state.isKeyValid && state.isConfidenceScoreValid,
        isURLValid,
      };
    }
    case "setKey": {
      const isKeyValid = action.issueKey.length > 0;
      return {
        ...state,
        issueKey: action.issueKey,
        isKeyValid,
        canSubmit:
          isKeyValid && state.isURLValid && state.isConfidenceScoreValid,
      };
    }
    case "setConfidenceScore": {
      if (action.confidenceScore.length === 0) {
        return {
          ...state,
          confidenceScore: null,
          isConfidenceScoreValid: true,
        };
      }
      const isNumber = !Number.isNaN(parseInt(action.confidenceScore, 10));
      if (!isNumber) {
        return {
          ...state,
          confidenceScore: action.confidenceScore,
          isConfidenceScoreValid: false,
        };
      }
      const isValid =
        parseInt(action.confidenceScore, 10) <= 100 &&
        parseInt(action.confidenceScore, 10) >= 0;
      return {
        ...state,
        confidenceScore: action.confidenceScore,
        isConfidenceScoreValid: isValid,
      };
    }
    default:
      throw new Error("Unrecognized action type");
  }
};

export const useAddIssueModal = () => {
  const [state, dispatch] = useReducer(reducer, null, init);

  const setUrl = (url: string) => {
    dispatch({ type: "setUrl", url });
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
  const setters = {
    setUrl,
    setKey,
    setConfidenceScore,
    reset,
  };
  return [state, setters] as const;
};
