import * as React from "react";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadForm from "./ProfileFileService";
import { UserContext } from "../../context/user-context";
import { AuthContext } from "../../context/auth-context";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useHttpClient } from "../../hooks/http-hook";
import defaultImage from "../../icons/placeholder-banner.png";

const ProfileBackground = () => {
  const { user, userCanEditPage, titlePicture, fetchTitlePicture } =
    React.useContext(UserContext);
  const [uploadBackgroundPicture, setUploadBackgroundPicture] =
    React.useState(false);
  const auth = React.useContext(AuthContext);
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  const uploadBackground = () => {
    setUploadBackgroundPicture(!uploadBackgroundPicture);
  };

  const onClose = () => {
    uploadBackground();
    fetchTitlePicture(user._id);
  };

  const deleteTitlePicture = async (event) => {
    let userPictureString = user.titlePicture;
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/user/deleteTitlePicture`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      window.location.reload(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid
      container
      sx={{
        height: "20vh",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        padding: "1rem",
        backgroundSize: "cover",
        backgroundImage: `url(${
          user.titlePicture ? titlePicture?.src : defaultImage
        })`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {titlePicture && (
        <IconButton onClick={deleteTitlePicture}>
          <DeleteForeverIcon sx={{ color: "grey" }}></DeleteForeverIcon>
        </IconButton>
      )}

      <IconButton onClick={uploadBackground}>
        {userCanEditPage && <EditIcon sx={{ color: "grey" }}></EditIcon>}
        <FileUploadForm
          open={uploadBackgroundPicture}
          toDoOnClose={onClose}
          multiple={false}
          type="titlePicture"
        ></FileUploadForm>
      </IconButton>
    </Grid>
  );
};

export default ProfileBackground;
