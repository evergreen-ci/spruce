import React, { useContext, useReducer } from "react";
import axios from "axios";

type State = {
  isAuthenticated: boolean;
};

const defaultState: State = {
  isAuthenticated: true
};

type Action = { type: "set auth"; payload: boolean };

type Dispatch = (action: Action) => void;

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

// this won't work in prod bc it does not know to go to evergreen.mongo.com
const logout = async (dispatch: Dispatch) => {
  try {
    await axios.get("/logout");
    dispatch({ type: "set auth", payload: false });
  } catch (error) {}
};

type LoginParams = {
  username: string;
  password: string;
};
const login = async (
  dispatch: Dispatch,
  { username, password }: LoginParams
) => {
  try {
    await axios.post("/login", { username, password });
    dispatch({ type: "set auth", payload: true });
  } catch (error) {}
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
  const authDispatch = useContext(AuthDispatchContext);
  if (authDispatch === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authDispatch;
};

export {
  AuthProvider,
  useAuthStateContext,
  useAuthDispatchContext,
  logout,
  login
};
