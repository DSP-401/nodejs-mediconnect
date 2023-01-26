import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ForotPassword from "../Auth/ForgotPassword";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Dashboard from "../Dashboard";
const allRoutes = [
  {
    name: "Login",
    path: "/login",
    protected: false,
    properties: { ketan: 1 },
    component: Login,
  },
  {
    name: "Forgot Password",
    path: "/forgotpassword",
    protected: true,
    component: ForotPassword,
  },
  {
    name: "Register",
    path: "/register",
    protected: false,
    component: Register,
  },
  {
    name: "dashboard",
    path: "/dashboard",
    protected: false,
    component: Dashboard,
  },
];
const PrivateRoute = ({ component: RouteComponent, ...rest }: any) => {
  //   const { userData } = rest;
  //   const currentRoute = allRoutes.filter((items) => items.path === rest.path);
  return (
    <Route
      {...rest}
      render={(routeProps) => <RouteComponent {...routeProps} {...rest} />}
    />
  );
};

const PublicRoute = ({
  component: Component,
  properties,
  restricted,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) => <Component properties={properties} {...props} />}
    />
  );
};

const Routes = (props: any) => {
  console.log(props);
  return (
    <>
      <Router>
        <Switch>
          {
            // props.userData.data ?
            allRoutes.map((items, i) =>
              items.protected ? (
                <PrivateRoute
                  path={items.path}
                  component={items.component}
                  exact
                  properties={items.properties}
                  {...props}
                />
              ) : (
                <PublicRoute
                  path={items.path}
                  component={items.component}
                  properties={items.properties}
                  exact
                  {...props}
                />
              )
            )
          }
          <>
            <Redirect to={"/login"} exact {...props} />
            {/* <Route path="" component={<></>} /> */}
          </>
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
