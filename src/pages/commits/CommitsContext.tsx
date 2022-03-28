import { useContext, createContext, useReducer, useMemo } from "react";

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

  const commitsState: CommitsState = useMemo(
    () => ({
      hoveredTaskIcon,
      setTaskIcon: (taskIcon: string) =>
        dispatch({ type: "setTaskIcon", taskIcon }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoveredTaskIcon]
  );
  return (
    <CommitsDispatchContext.Provider value={commitsState}>
      {children}
    </CommitsDispatchContext.Provider>
  );
};

const useCommits = (): CommitsState => {
  const context = useContext(CommitsDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useActiveCommits must be used within a ActiveCommitsProvider"
    );
  }
  return context;
};

export { CommitsProvider, useCommits };
