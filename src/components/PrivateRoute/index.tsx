import React from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";
import { useAuthStateContext } from "../../context/auth";

type PrivateRouteProps = {
  component: React.FC<RouteComponentProps>;
  path: string;
  exact?: boolean;
};

export const PrivateRoute = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => {
  const { isAuthenticated } = useAuthStateContext();

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { referer: props.location } }}
          />
        )
      }
    />
  );
};
