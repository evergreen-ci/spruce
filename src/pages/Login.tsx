import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import {
  useAuthDispatchContext,
  useAuthStateContext,
  login
} from "../context/auth";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Location } from "history";

const getReferer = (location: Location) => {
  if (location && location.state && "referer" in location.state) {
    const { referer } = location.state;
    return referer;
  }
  return "/";
};

export const Login: React.FC<RouteComponentProps> = ({ location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const loginHandler = () => {
    login(dispatch, { username, password });
  };

  if (isAuthenticated) {
    return <Redirect to={getReferer(location)} />;
  }

  return (
    <Wrapper>
      <label>Username</label>
      <input
        type="text"
        name="username"
        value={username}
        onChange={e => {
          setUsername(e.target.value);
        }}
      />
      <label>Password</label>
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
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
