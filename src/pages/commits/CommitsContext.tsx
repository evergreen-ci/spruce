import { useContext, createContext, useReducer, useMemo } from "react";
import debounce from "lodash.debounce";

// REDUCER
export interface CommitsReducerState {
  hoveredTaskIcon: string;
}

type Action = { type: "setTaskIcon"; taskIcon: string };

const reducer = (state: CommitsReducerState, action: Action) => {
  switch (action.type) {
    case "setTaskIcon":
      return {
        ...state,
        hoveredTaskIcon: action.taskIcon,
      };
    default:
      throw new Error(`Unknown reducer action ${action}`);
  }
};

// CONTEXT
interface CommitsState {
  hoveredTaskIcon: string;
  setTaskIcon: (taskIcon: string) => void;
}

const CommitsDispatchContext = createContext<any | null>(null);

interface CommitsProviderProps {
  children: React.ReactNode;
  initialState?: CommitsReducerState;
}
const CommitsProvider: React.FC<CommitsProviderProps> = ({
  children,
  initialState = {
    hoveredTaskIcon: null,
  },
}) => {
  const [{ hoveredTaskIcon }, dispatch] = useReducer(reducer, {
    ...initialState,
  });

  // It's possible for hundreds of hoverable icons to be visible. We should debounce so that
  // we don't trigger the task highlight on every hover event.
  const debounceSetTaskIcon = useMemo(
    () =>
      debounce((taskIcon) => {
        dispatch({ type: "setTaskIcon", taskIcon });
      }, 200),
    []
  );

  const commitsState: CommitsState = {
    hoveredTaskIcon,
    setTaskIcon: (taskIcon: string) => debounceSetTaskIcon(taskIcon),
  };

  return (
    <CommitsDispatchContext.Provider value={commitsState}>
      {children}
    </CommitsDispatchContext.Provider>
  );
};

const useCommits = (): CommitsState => {
  const context = useContext(CommitsDispatchContext);
  if (context === undefined) {
    throw new Error("useCommits must be used within a CommitsProvider");
  }
  return context;
};

export { CommitsProvider, useCommits };
