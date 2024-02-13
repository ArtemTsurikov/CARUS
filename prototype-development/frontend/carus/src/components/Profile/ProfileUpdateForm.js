import * as React from "react";
import {
  Container,
  Box,
  Grid,
  Dialog,
  DialogActions,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { UserContext } from "../../context/user-context";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import AlertModal from "../../components/AlertModal";
import CloseIcon from "@mui/icons-material/Close";

import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ProfileUpdateForm = (props) => {
  const auth = React.useContext(AuthContext);
  const { user, fetchUser } = React.useContext(UserContext);
  const history = useHistory();

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  const handleAlertModalClose = () => {
    if (alertModal.type === "success") {
      props.onClose();
    }
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  const initialState = {
    inputs: {
      name: { value: "", isValid: true },
      lastName: { value: "", isValid: true },
      street: { value: "", isValid: true },
      houseNumber: { value: "", isValid: true },
      zipCode: { value: "", isValid: true },
      city: { value: "", isValid: true },
      email: { value: "", isValid: true },
    },
    isValid: false,
  };

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );
  const [nameError, setNameError] = React.useState(false);
  const [lastNameError, setLastNameError] = React.useState(false);
  const [streetError, setStreetError] = React.useState(false);
  const [houseNumberError, setHouseNumberError] = React.useState(false);
  const [zipCodeError, setZipCodeError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);

  // Account creation handler
  const handleUpdateAccount = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          email: state.inputs.email.value
            ? state.inputs.email.value
            : user.eMail,
          firstName: state.inputs.name.value
            ? state.inputs.name.value
            : user.firstName,
          lastName: state.inputs.lastName.value
            ? state.inputs.lastName.value
            : user.lastName,
          address: {
            street: state.inputs.street.value
              ? state.inputs.street.value
              : user.address.street,
            houseNumber: state.inputs.houseNumber.value
              ? state.inputs.houseNumber.value
              : user.address.houseNumber,
            zipCode: state.inputs.zipCode.value
              ? state.inputs.zipCode.value
              : user.address.zipCode,
            city: state.inputs.city.value
              ? state.inputs.city.value
              : user.address.city,
          },
        }),
      });

      const responseData = await response.json();
      fetchUser(user._id);
      setAlertModal({
        open: true,
        statusTitle: "Profile update succeeded",
        status: "Your profile was updated succesfully",
        type: "success",
      });
    } catch (err) {
      console.log(err);

      setAlertModal({
        open: true,
        statusTitle: "Profile update failed",
        status: err.message,
        type: "error",
      });
    }
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/user/deleteUser",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
          body: null,
        }
      );

      const responseData = await response.json();
      setAlertModal({
        open: true,
        statusTitle: "Profile was deleted",
        status: "Your profile was deleted succesfully",
        type: "success",
      });
      auth.logout();
      history.push("/");
    } catch (err) {
      console.log(err);
      setAlertModal({
        open: true,
        statusTitle: "Profile deletion failed",
        status: err.message,
        type: "error",
      });
    }
  };

  const handleDeletionWarning = (event) => {
    event.preventDefault();
    setAlertModal({
      open: true,
      statusTitle: "Warning",
      status: "Are you sure that you want to delete this profile?",
      type: "warning",
    });
  };

  return (
    <>
      <AlertModal
        open={alertModal.open}
        statusTitle={alertModal.statusTitle}
        status={alertModal.status}
        type={alertModal.type}
        onClick={handleAlertModalClose}
        handleDelete={handleDeleteAccount}
      />
      <Dialog open={props.open} onClose={props.onClose}>
        <DialogActions>
          <IconButton
            onClick={props.onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon></CloseIcon>
          </IconButton>
        </DialogActions>
        <Container maxWidth="md">
          <Box
            sx={{
              my: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ pb: 5 }}>
              Your Profile
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.firstName}
                  fullWidth
                  id="name"
                  label="Name"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setNameError,
                      "OnlyLetterInput"
                    )
                  }
                  error={nameError}
                  helperText={nameError && "Please enter only letters."}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.lastName}
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setLastNameError,
                      "OnlyLetterInput"
                    )
                  }
                  error={lastNameError}
                  helperText={lastNameError && "Please enter only letters."}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.address ? user.address.street : ""}
                  fullWidth
                  id="street"
                  label="Street"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setStreetError,
                      "OnlyLetterInput"
                    )
                  }
                  error={streetError}
                  helperText={streetError && "Please enter only letters."}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.address ? user.address.houseNumber : ""}
                  fullWidth
                  id="houseNumber"
                  label="House Number"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setHouseNumberError,
                      "OnlyNumberOrLetterInput"
                    )
                  }
                  error={houseNumberError}
                  helperText={
                    houseNumberError && "Please enter only letters or numbers."
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.address ? user.address.zipCode : ""}
                  fullWidth
                  id="zipCode"
                  label="ZIP Code"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setZipCodeError,
                      "OnlyNumberInput"
                    )
                  }
                  error={zipCodeError}
                  helperText={zipCodeError && "Please enter only numbers."}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={user.address ? user.address.city : ""}
                  fullWidth
                  id="city"
                  label="City"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setCityError,
                      "OnlyLetterInput"
                    )
                  }
                  error={cityError}
                  helperText={cityError && "Please enter only letters."}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  defaultValue={user.email}
                  fullWidth
                  id="email"
                  label="E-Mail address"
                  variant="outlined"
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setEmailError,
                      "EmailInput"
                    )
                  }
                  error={emailError}
                  helperText={emailError && "The email is not valid."}
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="space-evenly" marginTop="5%">
              <Button
                type="warning"
                variant="contained"
                onClick={handleDeletionWarning}
                color="error"
              >
                Delete Account
              </Button>

              <Button
                type="submit"
                variant="contained"
                onClick={handleUpdateAccount}
                disabled={!state.isValid}
              >
                Update Profile
              </Button>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </>
  );
};

export default ProfileUpdateForm;
