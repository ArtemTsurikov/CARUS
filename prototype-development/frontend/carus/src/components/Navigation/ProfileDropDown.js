import * as React from "react";
import {
  ButtonGroup,
  IconButton,
  Box,
  Menu,
  MenuList,
  Avatar,
  Button,
} from "@mui/material";
import { AuthContext } from "../../context/auth-context";

const ProfileDropDown = () => {
  const auth = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const [profilePicture, setProfilPicture] = React.useState("");

  React.useEffect(() => {
    if (auth.userId) {
      fetchProfilePicture(auth.userId);
    }
  }, [auth]);

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    auth.logout();
  };

  const fetchProfilePicture = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/getProfilePicture/${userId}`,
        {
          method: "GET",
          body: null,
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      )
        .then((res) => res.blob())
        .then((blob) => {
          setProfilPicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <Box justifyContent="end">
        <IconButton onClick={handleOpenNavMenu}>
          <Avatar src={profilePicture?.src} />
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
        >
          <MenuList sx={{ px: 2 }} onClick={handleCloseNavMenu}>
            <ButtonGroup variant="text" orientation="vertical">
              <Button
                href={`/profile/${auth.userId}`}
                sx={{ mx: 1, my: 1 }}
                textalign="center"
              >
                My Profile
              </Button>
              <Button sx={{ mx: 1, my: 1 }} textalign="center" href="/myOffers">
                My Offers
              </Button>
              <Button
                sx={{ mx: 1, my: 1 }}
                textalign="center"
                href="/mySharings"
              >
                My Sharings
              </Button>
              <Button
                sx={{ mx: 1, my: 1 }}
                textalign="center"
                href="/myRequests"
              >
                My Rentals
              </Button>
              <Button
                sx={{ mx: 1, my: 1 }}
                textalign="center"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ButtonGroup>
          </MenuList>
        </Menu>
      </Box>
    </React.Fragment>
  );
};

export default ProfileDropDown;
