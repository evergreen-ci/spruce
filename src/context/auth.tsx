import React, { useContext, useReducer } from "react";
import axios from "axios";
import { environmentalVariables } from "utils";
import { leaveBreadcrumb } from "utils/errorReporting";

const { getLoginDomain } = environmentalVariables;
interface AuthState {
  isAuthenticated: boolean;
}

type Action = { type: "authenticated" } | { type: "deauthenticated" };

type LoginCreds = { username: string; password: string };
interface DispatchContext {
  login: (creds: LoginCreds) => void;
  logoutAndRedirect: () => void;
  dispatchAuthenticated: () => void;
}

const reducer = (state: AuthState, action: Action): AuthState => {
  // check to see if the authenticate state has changed otherwise dont update the reducer
  switch (action.type) {
    case "authenticated":
      return { ...state, isAuthenticated: true };
    case "deauthenticated":
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
};

const AuthDispatchContext = React.createContext<DispatchContext | null>(null);
const AuthStateContext = React.createContext<AuthState | null>(null);

const AuthProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
  });

  const dispatchContext: DispatchContext = {
    login: async ({ username, password }) => {
      await axios.post(`${getLoginDomain()}/login`, { username, password });
      dispatch({ type: "authenticated" });
    },
    logoutAndRedirect: async () => {
      // attempt log out and redirect to login page
      try {
        await axios.get(`${getLoginDomain()}/logout`);
      } catch {}
      dispatch({ type: "deauthenticated" });
      window.location.href = `${getLoginDomain()}/login`;
    },
    dispatchAuthenticated: () => {
      if (!state.isAuthenticated) {
        dispatch({ type: "authenticated" });
        leaveBreadcrumb("Authenticated", {}, "user");
      }
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
