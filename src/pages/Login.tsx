import React, { useState } from "react";
import styled from "@emotion/styled";
import { Location } from "history";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useAuthDispatchContext, useAuthStateContext } from "context/auth";

const getReferrer = (location: Location<{ referrer?: string }>): string => {
  if (location && location.state && "referrer" in location.state) {
    return location.state.referrer;
  }
  return "/";
};

export const Login: React.FC<RouteComponentProps> = ({ location }) => {
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
    return <Redirect to={getReferrer(location)} />;
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
