import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import LoginForm from "../components/Sign-In-Up/LoginForm";
import background from "../icons/LoginPageBackground.png";
import { Grid, Typography } from "@mui/material";
import { AuthContext } from "../context/auth-context";
import { Redirect } from "react-router-dom";
import { useAuth } from "../hooks/auth-hook";

const LoginPage = () => {

  const isLoggedIn = JSON.parse(localStorage.getItem("userData"));

  return (
    <div>
      <NavBarNew />
      <Grid container sx={{ height: "87vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${background})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: { md: "flex", xs: "none" },
          }}
        ></Grid>
        <LoginForm />
      </Grid>
      {isLoggedIn && (<Redirect to = {`/profile/${isLoggedIn["userId"]}`}></Redirect>)}
    </div>
  );
};

export default LoginPage;
