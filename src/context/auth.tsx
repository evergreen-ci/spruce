import React, { useContext, useReducer } from "react";
import axios from "axios";
import { getLoginDomain } from "utils/getEnvironmentVariables";

interface AuthState {
  isAuthenticated: boolean;
  initialLoad: boolean;
}

type Action = { type: "authenticated" } | { type: "deauthenticated" };

type LoginCreds = { username: string; password: string };
interface DispatchContext {
  login: (creds: LoginCreds) => void;
  logout: () => void;
  dispatchAuthenticated: () => void;
}

const reducer = (state: AuthState, action: Action): AuthState => {
  // check to see if the authenticate state has changed otherwise dont update the reducer
  if (
    state.isAuthenticated &&
    !state.initialLoad &&
    action.type === "authenticated"
  ) {
    return state;
  }

  const authenticatedState = {
    ...state,
    isAuthenticated: true,
    initialLoad: false,
  };
  const deauthenticatedState = {
    ...state,
    isAuthenticated: false,
    initialLoad: false,
  };

  switch (action.type) {
    case "authenticated":
      return authenticatedState;
    case "deauthenticated":
      return deauthenticatedState;
    default:
      return state;
  }
};

const AuthDispatchContext = React.createContext<DispatchContext | null>(null);
const AuthStateContext = React.createContext<AuthState | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
    initialLoad: true,
  });

  const dispatchContext: DispatchContext = {
    login: async ({ username, password }) => {
      await axios.post(`${getLoginDomain()}/login`, { username, password });
      dispatch({ type: "authenticated" });
    },
    logout: async () => {
      await axios.get(`${getLoginDomain()}/logout`);
      dispatch({ type: "deauthenticated" });
    },
    dispatchAuthenticated: () => {
      dispatch({ type: "authenticated" });
    },
  };

  return (
    <AuthDispatchContext.Provider value={dispatchContext}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

const useAuthStateContext = (): AuthState => {
  const authState = useContext(AuthStateContext);
  if (authState === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authState;
};

const useAuthDispatchContext = (): DispatchContext => {
  const authDispatch = useContext(AuthDispatchContext);
  if (authDispatch === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authDispatch;
};

export { AuthProvider, useAuthStateContext, useAuthDispatchContext };
