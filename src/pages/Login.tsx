import React, { useState } from "react";
import styled from "@emotion/styled";
import { Location } from "history";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthDispatchContext, useAuthStateContext } from "context/auth";

const getReferrer = (location: Location): string =>
  // ts-ignore next-line
  location.state?.referrer ?? "/";

export const Login: React.VFC = () => {
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const loginHandler = (): void => {
    login({ username, password });
  };

  const inputChangeHandler = (cb: (value: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    cb(e.target.value);
  };

  if (isAuthenticated) {
    return <Navigate to={getReferrer(location)} />;
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
