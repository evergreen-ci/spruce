import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import { useAuthDispatchContext, useAuthStateContext } from "../context/auth";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Location } from "history";

const getReferrer = (location: Location<{ referrer?: string }>) => {
  return location.state.referrer ?? "/";
};

export const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const loginHandler = () => {
    login({ username, password });
  };

  const inputChangeHandler = (cb: (value: string) => void) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    cb(e.target.value);
  };

  if (isAuthenticated) {
    return <Redirect to={getReferrer(location)} />;
  }

  return (
    <Wrapper>
      <label>Username</label>
      <input
        type="text"
        name="username"
        value={username}
        onChange={inputChangeHandler(setUsername)}
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={inputChangeHandler(setPassword)}
      />
      <button id="login-submit" onClick={loginHandler}>
        Login
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div({
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column"
});
