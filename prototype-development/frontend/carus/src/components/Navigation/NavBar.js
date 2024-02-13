import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import NavLinks from "./NavLinks";

import { IconButton, Typography } from "@mui/material";

const NavBar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: "black" }}>
      <Container maxWidth="100%">
        <Toolbar sx={{ height: "13vh" }}>
          <IconButton href="/" size="large" edge="start">
            <img
              src={require("../../icons/CARUS-Logo.svg").default}
              width="70"
              height="70"
              alt="CARUS logo"
            />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: "bold",
              fontSize: 20,
              color: "white",
            }}
          >
            CARUS
          </Typography>
          <NavLinks />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
