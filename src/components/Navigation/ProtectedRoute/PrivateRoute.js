import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state?.users);
  const { loginUserAuth } = user;

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("userAuth") && loginUserAuth ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export { PrivateRoute };
