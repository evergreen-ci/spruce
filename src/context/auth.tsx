import React, { useContext, useReducer, useCallback } from "react";
import axios from "axios";
import { getUiUrl } from "utils/getEnvironmentVariables";

interface State {
  isAuthenticated: boolean;
}

const defaultState: State = {
  isAuthenticated: false
};

type Action = { type: "authenticate" } | { type: "deauthenticate" };

type Dispatch = (action: Action) => void;

export type Logout = () => void;

interface DispatchContext {
  login: (LoginParams) => void;
  logout: Logout;
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "authenticate":
      return {
        ...state,
        isAuthenticated: true
      };
    case "deauthenticate":
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

const logout = async (dispatch: Dispatch) => {
  try {
    await axios.get(`${getUiUrl()}/logout`);
    dispatch({ type: "deauthenticate" });
  } catch (error) {
    // TODO: log errors
  }
};

interface LoginParams {
  username: string;
  password: string;
}
const login = async (
  dispatch: Dispatch,
  { username, password }: LoginParams
) => {
  try {
    await axios.post(`${getUiUrl()}/login`, { username, password });
    dispatch({ type: "authenticate" });
  } catch (error) {
    // TODO: log errors
  }
};

const AuthDispatchContext = React.createContext<DispatchContext | null>(null);
const AuthStateContext = React.createContext<State | null>(null);

const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const logoutHandler = useCallback(() => {
    logout(dispatch);
  }, [dispatch]);

  const loginHandler = useCallback(
    ({ username, password }: LoginParams) => {
      login(dispatch, { username, password });
    },
    [dispatch]
  );

  const dispatchContext: DispatchContext = {
    login: loginHandler,
    logout: logoutHandler
  };

  return (
    <AuthDispatchContext.Provider value={dispatchContext}>
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
  const authDispatch = useContext(AuthDispatchContext);
  if (authDispatch === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authDispatch;
};

export { AuthProvider, useAuthStateContext, useAuthDispatchContext };
