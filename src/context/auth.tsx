import { createContext, useContext, useMemo, useReducer } from "react";
import axios from "axios";
import { environmentVariables } from "utils";
import { leaveBreadcrumb } from "utils/errorReporting";

const { getLoginDomain, getUiUrl } = environmentVariables;

interface AuthState {
  isAuthenticated: boolean;
}

type Action = { type: "authenticated" } | { type: "deauthenticated" };

type LoginCreds = { username: string; password: string };
interface DispatchContext {
  devLogin: (creds: LoginCreds) => void;
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

const AuthDispatchContext = createContext<DispatchContext | null>(null);
const AuthStateContext = createContext<AuthState | null>(null);

const AuthProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
  });

  const dispatchContext: DispatchContext = useMemo(
    () => ({
      // This function is only used in local development.
      devLogin: async ({ password, username }) => {
        await axios
          .post(
            `${getUiUrl()}/login`,
            { username, password },
            { withCredentials: true }
          )
          .then((response) => {
            if (response.status === 200) {
              dispatch({ type: "authenticated" });
            }
          });
      },
      logoutAndRedirect: async () => {
        // attempt log out and redirect to login page
        try {
          await axios.get(`${getUiUrl()}/logout`);
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
    }),
    [state.isAuthenticated]
  );

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
