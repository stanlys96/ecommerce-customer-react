import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRouteHome({ isAuth: isAuth, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === "not_logged_in" || isAuth == null) {
          return <Component />;
        } else {
          return (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          );
        }
      }}
    />
  )
}

export default ProtectedRouteHome;