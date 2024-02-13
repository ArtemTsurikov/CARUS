import * as React from "react";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import ProfileUpdateForm from "./ProfileUpdateForm";
import FileUploadForm from "./ProfileFileService";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";
import VerifiedIcon from "@mui/icons-material/Verified";
import { UserContext } from "../../context/user-context";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

const ProfileInfoCard = () => {
  const auth = React.useContext(AuthContext);
  const {requestError, sendRequest, resetError } = useHttpClient();
  const {
    user,
    userCanEditPage,
    profilePicture,
    fetchProfilePicture,
    fetchUser,
  } = React.useContext(UserContext);
  const [nameSectionEditable, setNameSectionEditable] = React.useState(false);
  const [personalSectionIsEditable, setPersonalSectionIsEditable] =
    React.useState(false);
  const [aboutMeText, setAboutMeText] = React.useState();
  const [uploadProfilPicture, setUploadProfilPicture] = React.useState(false);
  const [uploadIdentityCard, setUploadIdentityCard] = React.useState(false);
  const [uploadDrivingLicence, setUploadDrivingLicence] = React.useState(false);

  React.useEffect(() => {
    setAboutMeText(user.description);
  }, [user]);

  const editNameSection = () => {
    setNameSectionEditable(!nameSectionEditable);
  };

  const editIdentityCard = () => {
    setUploadIdentityCard(!uploadIdentityCard);
  };

  const endUploadIdentityCard = () => {
    editIdentityCard();
    fetchUser(user._id);
  };

  const editPersonalSection = () => {
    setPersonalSectionIsEditable(!personalSectionIsEditable);
  };

  const cancelEditPersonalSection = () => {
    setAboutMeText(user.description);
    setPersonalSectionIsEditable(!personalSectionIsEditable);
  };

  const onSavePersonalSection = async () => {
    setPersonalSectionIsEditable(false);
    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          description: aboutMeText,
        }),
      });

      const responseData = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const editProfilePicture = () => {
    setUploadProfilPicture(!uploadProfilPicture);
  };

  const endUploadProfilPicture = () => {
    fetchProfilePicture(user._id);
    editProfilePicture();
  };

  const editDrivingLicence = () => {
    setUploadDrivingLicence(!uploadDrivingLicence);
  };

  const endEditDrivingLicences = () => {
    editDrivingLicence();
    fetchUser(user._id);
  };

  const updatePaymentDetails = async () => {
    try {
      const res = await sendRequest(
        "http://localhost:5000/api/user/updatePayment",
        "POST",
        JSON.stringify({
          user: auth.userId
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      /* Redirect to stripe payment details form */
      window.location = res.url;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {" "}
      <ProfileUpdateForm
        open={nameSectionEditable}
        onClose={editNameSection}
      ></ProfileUpdateForm>
      <Grid container direction="column" padding="7rem" paddingTop="5%" gap={5}>
        <Grid container textAlign="start">
          <Typography>{ }</Typography>
          <Box marginTop="2vh">
            <Grid item>
              <Grid item position="absolute" top="21vh">
                <IconButton
                  disabled={!userCanEditPage}
                  component="label"
                  onClick={editProfilePicture}
                >
                  <Avatar
                    src={profilePicture?.src}
                    sx={{
                      width: "18vh",
                      height: "18vh",
                    }}
                  ></Avatar>
                  <FileUploadForm
                    open={uploadProfilPicture}
                    toDoOnClose={endUploadProfilPicture}
                    multiple={false}
                    type="profilePicture"
                  ></FileUploadForm>
                </IconButton>
              </Grid>
              <Grid container flexWrap="nowrap">
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {user.firstName} {user.lastName}
                </Typography>
                {userCanEditPage && (
                  <IconButton onClick={editNameSection}>
                    <EditIcon></EditIcon>
                  </IconButton>
                )}
              </Grid>
            </Grid>
            <Typography variant="body1"> { }</Typography>
            <Grid container>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                Rating: {user.rating?.toString().slice(0, 3)}
              </Typography>
              <StarIcon></StarIcon>
            </Grid>
            <Typography variant="body1">
              {user.address?.city} - Member since{" "}
              {user.creationDate?.slice(0, 4)}
            </Typography>
          </Box>
        </Grid>
        <Grid item textAlign="start">
          <Box>
            <Grid container wrap="nowrap">
              <Grid item>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  About {user.firstName}
                </Typography>
              </Grid>
              {userCanEditPage && !personalSectionIsEditable && (
                <Grid item>
                  <IconButton onClick={editPersonalSection}>
                    <EditIcon></EditIcon>
                  </IconButton>
                </Grid>
              )}
            </Grid>
            {personalSectionIsEditable && (
              <Box>
                <TextField
                  variant="standard"
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  value={aboutMeText}
                  multiline
                  disabled={!personalSectionIsEditable}
                  onChange={(e) => setAboutMeText(e.target.value)}
                ></TextField>
                <Button onClick={cancelEditPersonalSection}>Cancel</Button>
                <Button onClick={onSavePersonalSection}>Save</Button>
              </Box>
            )}
            {!personalSectionIsEditable && (
              <Box>
                <Typography>{aboutMeText}</Typography>
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item textAlign="start">
          <Grid>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Verified Information
            </Typography>
            <Grid>
              <Grid container alignItems="center">
                <Typography>
                  Identity Card
                  {userCanEditPage && (
                    <>
                      <IconButton onClick={editIdentityCard}>
                        <FileUploadIcon></FileUploadIcon>
                      </IconButton>
                    </>
                  )}
                  <FileUploadForm
                    open={uploadIdentityCard}
                    toDoOnClose={endUploadIdentityCard}
                    multiple={true}
                    type="identityCardPicture"
                    verified={user.identityCardStatus}
                  ></FileUploadForm>
                </Typography>
                {user.identityCardStatus === "Verified" ? (
                  <VerifiedIcon sx={{ color: "green" }}></VerifiedIcon>
                ) : user.identityCardStatus === "Pending" ? (
                  <PendingIcon></PendingIcon>
                ) : (
                  <CancelIcon></CancelIcon>
                )}
              </Grid>
            </Grid>
            <Grid container alignItems="center">
              <Typography> Payment details</Typography>
              <IconButton onClick={updatePaymentDetails}>
                <EditIcon></EditIcon>
              </IconButton>
              {user.paymentDetails === true ? (
                <VerifiedIcon sx={{ color: "green" }}></VerifiedIcon>
              ) : (<PendingIcon></PendingIcon>)}
            </Grid>
          </Grid>
        </Grid>
        <Grid item textAlign="start" wrap="nowrap">
          <Grid container wrap="nowrap">
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Driving Licenses
            </Typography>
            {userCanEditPage && (
              <IconButton onClick={editDrivingLicence}>
                <FileUploadIcon></FileUploadIcon>
              </IconButton>
            )}
            <FileUploadForm
              open={uploadDrivingLicence}
              toDoOnClose={endEditDrivingLicences}
              multiple={true}
              type="drivingLicensePicture"
              verified={user.drivingLicenseStatus}
            ></FileUploadForm>
          </Grid>
          <Grid item>
            {userCanEditPage ? (
              user.drivingLicenseClasses?.length > 0 ? (
                <Typography>{`Your current driving licence classes are : ${user.drivingLicenseClasses?.join(
                  ", "
                )}`}</Typography>
              ) : (
                <Typography>You did not provide a licence yet</Typography>
              )
            ) : (
              <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                You did not upload any licenses yet
              </Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfileInfoCard;
