import React from "react";
import { Route, Redirect } from "react-router-dom";

type PrivateRouteProps = {
  component: React.FC;
  path: string;
};

export const PrivateRoute = ({
  component: Component,
  ...rest
}: PrivateRouteProps) => {
  const auth = false;

  return (
    <Route
      {...rest}
      render={props =>
        auth ? (
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
