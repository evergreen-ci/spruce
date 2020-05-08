import React from "react";
import {
  Route,
  Redirect,
  RouteComponentProps,
  RouteProps,
} from "react-router-dom";
import { useAuthStateContext } from "../../context/auth";

type PrivateRouteProps = RouteProps & {
  component?: React.FC<RouteComponentProps>;
};

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { isAuthenticated } = useAuthStateContext();
  const render = (props): JSX.Element => {
    const { location } = props;
    return isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect to={{ pathname: "/login", state: { referrer: location } }} />
    );
  };

  return <Route {...rest} render={render} />;
};
