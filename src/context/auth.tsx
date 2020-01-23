import React, { useContext, useReducer } from "react";

type State = {
  isAuthenticated: boolean;
};

type Action = { type: "set auth"; payload: boolean };

type Dispatch = (action: Action) => void;

const defaultState: State = {
  isAuthenticated: false
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "set auth":
      return {
        ...state,
        isAuthenticated: action.payload
      };
    default:
      return state;
  }
};

const AuthDispatchContext = React.createContext<Dispatch | null>(null);
const AuthStateContext = React.createContext<State | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

const useAuthStateContext = () => {
  const authState = useContext(AuthStateContext);
  if (authState === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authState;
};

const useAuthDispatchContext = () => {
  const authDispatch = useContext(AuthStateContext);
  if (authDispatch === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authDispatch;
};

export { AuthProvider, useAuthStateContext, useAuthDispatchContext };
