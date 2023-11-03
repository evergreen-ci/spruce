import { createContext, useContext, useMemo, useReducer } from "react";
import { environmentVariables } from "utils";
import { leaveBreadcrumb, SentryBreadcrumb } from "utils/errorReporting";

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

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isAuthenticated: false,
  });

  const dispatchContext: DispatchContext = useMemo(
    () => ({
      // This function is only used in local development.
      devLogin: async ({ password, username }) => {
        await fetch(`${getUiUrl()}/login`, {
          body: JSON.stringify({ password, username }),
          credentials: "include",
          method: "POST",
        }).then((response) => {
          if (response.ok) {
            dispatch({ type: "authenticated" });
          } else {
            dispatch({ type: "deauthenticated" });
          }
        });
      },
      logoutAndRedirect: async () => {
        await fetch(`${getUiUrl()}/logout`, {
          credentials: "include",
          method: "GET",
          redirect: "manual",
        })
          .then(() => {
            dispatch({ type: "deauthenticated" });
            window.location.href = `${getLoginDomain()}/login`;
          })
          .catch((error) => {
            leaveBreadcrumb("Logout failed", { error }, SentryBreadcrumb.User);
          });
      },
      dispatchAuthenticated: () => {
        if (!state.isAuthenticated) {
          dispatch({ type: "authenticated" });
          leaveBreadcrumb("Authenticated", {}, SentryBreadcrumb.User);
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
  if (authState === null || authState === undefined) {
    throw new Error(
      "useAuthStateContext must be used within an auth context provider"
    );
  }
  return authState;
};

const useAuthDispatchContext = (): DispatchContext => {
  const authDispatch = useContext(AuthDispatchContext);
  if (authDispatch === null || authDispatch === undefined) {
    throw new Error(
      "useAuthDispatchContext must be used within an auth context provider"
    );
  }
  return authDispatch;
};

export { AuthProvider, useAuthStateContext, useAuthDispatchContext };
