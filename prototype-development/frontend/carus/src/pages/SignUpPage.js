import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import SignUpForm from "../components/Sign-In-Up/SignUpForm";
import { AuthContext } from "../context/auth-context";
import { Redirect } from "react-router-dom";

const SignUpPage = () => {
  const isLoggedIn = JSON.parse(localStorage.getItem("userData"));
  const auth = React.useContext(AuthContext);

  return (
    <div>
      <NavBarNew />
      <SignUpForm />
      {isLoggedIn && (
        <Redirect to={`/profile/${isLoggedIn["userId"]}`}></Redirect>
      )}
    </div>
  );
};

export default SignUpPage;
