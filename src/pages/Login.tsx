import React, { useState } from "react";
import styled from "@emotion/styled/macro";
import {
  useAuthDispatchContext,
  useAuthStateContext,
  login
} from "../context/auth";
import { Redirect, RouteComponentProps } from "react-router-dom";

type LoginProps = RouteComponentProps & {
  location: {
    state: {
      referer: string;
    };
  };
};

export const Login: React.FC<LoginProps> = ({ location }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAuthDispatchContext();
  const { isAuthenticated } = useAuthStateContext();

  const referer = location.state.referer || "/";

  const loginHandler = () => {
    login(dispatch, { username, password });
  };

  if (isAuthenticated) {
    return <Redirect to={referer} />;
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
        type="text"
        name="password"
        value={password}
        onChange={e => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={loginHandler}>Login</button>
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
