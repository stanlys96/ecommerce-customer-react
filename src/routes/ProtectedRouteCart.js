import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRouteCart({ isAuth: isAuth, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuth === "logged_in") {
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

export default ProtectedRouteCart;