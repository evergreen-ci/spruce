import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthDispatchContext, useAuthStateContext } from "context/Auth";
import { secretFieldsReq } from "gql/fetch";
import { getGQLUrl } from "utils/environmentVariables";
import { fetchWithRetry } from "utils/request";

type LocationState = {
  referrer?: string;
};

const getReferrer = (location: LocationState): string => {
  const locationState = location as LocationState;
  return locationState?.referrer ?? "/";
};

export const Login: React.FC = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { devLogin } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();
  const { dispatchAuthenticated } = useAuthDispatchContext();

  // Check if the user is already authenticated
  useEffect(() => {
    fetchWithRetry(getGQLUrl(), secretFieldsReq).then(() => {
      dispatchAuthenticated();
    });
  }, []);
  const loginHandler = (): void => {
    devLogin({ username, password });
  };

  const inputChangeHandler =
    (cb: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      cb(e.target.value);
    };

  if (isAuthenticated) {
    return <Navigate to={getReferrer(location.state)} />;
  }
  return (
    <Wrapper>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        id="username"
        value={username}
        onChange={inputChangeHandler(setUsername)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={inputChangeHandler(setPassword)}
      />
      <button id="login-submit" onClick={loginHandler} type="submit">
        Login
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
