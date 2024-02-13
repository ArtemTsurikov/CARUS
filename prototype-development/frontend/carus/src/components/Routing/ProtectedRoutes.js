import { Redirect, Route } from "react-router-dom/cjs/react-router-dom.min";
import { AuthContext } from "../../context/auth-context";
import * as React from "react";

const ProtectedRoutes = ({ children, ...rest }) => {
  const auth = React.useContext(AuthContext);
  const isLoggedIn = localStorage.getItem("userData");

  return (
    <Route {...rest}>
      {!isLoggedIn && <Redirect to={`/login`}></Redirect>}
      {children}
      
    </Route>
  );
};

export default ProtectedRoutes;
