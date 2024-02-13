import * as React from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { AuthContext } from "../../context/auth-context";
import MenuIcon from "@mui/icons-material/Menu";
import ProfileDropDown from "./ProfileDropDown";
import {
  ButtonGroup,
  IconButton,
  Stack,
  Box,
  Menu,
  MenuList,
} from "@mui/material";

const NavLinks = () => {
  const auth = React.useContext(AuthContext);

  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    auth.logout();
  };

  return (
    <Container>
      <Stack
        direction="row"
        justifyContent="end"
        spacing={4}
        sx={{ display: { md: "flex", xs: "none" } }}
      >
        <ButtonGroup variant="text">
          <Button href="/whyCarus" sx={{ color: "white", fontWeight: "bold" }}>
            Why Carus?
          </Button>
          <Button href="/searchCar" sx={{ color: "white", fontWeight: "bold" }}>
            Rent a Car
          </Button>
          <Button href="/myOffers" sx={{ color: "white", fontWeight: "bold" }}>
            Share a Car
          </Button>
        </ButtonGroup>
        {!auth.isLoggedIn && (
          <Button
            href="/login"
            variant="outlined"
            sx={{
              borderColor: "white",
              color: "white",
              fontWeight: "bold",
              "&:hover": { borderColor: "#005778", color: "white" },
            }}
          >
            Log in
          </Button>
        )}
        {auth.isLoggedIn && <ProfileDropDown />}
      </Stack>

      {/* For small screen sizes */}
      <Box
        justifyContent="end"
        sx={{ display: { xs: "flex", md: "none" }, alignItems: "right" }}
      >
        <IconButton size="medium" onClick={handleOpenNavMenu}>
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
        <Menu
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}
        >
          <MenuList sx={{ px: 2 }} onClick={handleCloseNavMenu}>
            <ButtonGroup variant="text" orientation="vertical">
              <Button sx={{ mx: 1, my: 1 }} textalign="center">
                Why Carus?
              </Button>
              <Button sx={{ mx: 1, my: 1 }} textalign="center">
                Rent a car
              </Button>
              <Button sx={{ mx: 1, my: 1 }} textalign="center">
                Share a car
              </Button>
              {!auth.isLoggedIn ? (
                <Button href="/login" sx={{ mx: 1, my: 1 }} textalign="center">
                  Log in
                </Button>
              ) : (
                <ButtonGroup variant="text" orientation="vertical">
                  <Button
                    href={`/profile/${auth.userId}`}
                    sx={{ mx: 1, my: 1 }}
                    textalign="center"
                  >
                    My Profile
                  </Button>
                  <Button
                    href=""
                    sx={{ mx: 1, my: 1 }}
                    textalign="center"
                    onClick={handleLogout}
                  >
                    Log out
                  </Button>
                </ButtonGroup>
              )}
            </ButtonGroup>
          </MenuList>
        </Menu>
      </Box>
    </Container>
  );
};

export default NavLinks;
