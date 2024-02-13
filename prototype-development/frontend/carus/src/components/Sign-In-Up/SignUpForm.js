import {
  Typography,
  Grid,
  Box,
  TextField,
  Container,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  IconButton,
  FormHelperText,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import * as React from "react";
import { AuthContext } from "../../context/auth-context";
import AlertModal from "../AlertModal";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";

// Initial state of the signup form
const initialState = {
  inputs: {
    name: { value: "", isValid: false },
    surname: { value: "", isValid: false },
    street: { value: "", isValid: false },
    houseNumber: { value: "", isValid: false },
    zipCode: { value: "", isValid: false },
    city: { value: "", isValid: false },
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
    secondPassword: { value: "", isValid: false },
  },
  isValid: false,
};

const SignUpForm = () => {
  const auth = React.useContext(AuthContext);

  const [alertModal, setAlertModal] = React.useState(false);

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  // Show/Hide password
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // User input errors
  const [nameError, setNameError] = React.useState(false);
  const [surnameError, setSurnameError] = React.useState(false);
  const [streetError, setStreetError] = React.useState(false);
  const [houseNumberError, sethouseNumberError] = React.useState(false);
  const [zipCodeError, setZipCodeError] = React.useState(false);
  const [cityError, setCityError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [secondPasswordError, setSecondPasswordError] = React.useState(false);

  const handleAlertModalClose = () => {
    setAlertModal(false);
    resetError();
  };

  // Account creation handler
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/auth/register",
        "POST",
        JSON.stringify({
          firstName: state.inputs.name.value,
          lastName: state.inputs.surname.value,
          "address.street": state.inputs.street.value,
          "address.houseNumber": state.inputs.houseNumber.value,
          "address.zipCode": state.inputs.zipCode.value,
          "address.city": state.inputs.city.value,
          email: state.inputs.email.value,
          password: state.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(res.userId, res.token);
      window.location.reload(false);
    } catch (error) {
      setAlertModal(true);
    }
  };

  return (
    <React.Fragment>
      <AlertModal
        open={alertModal}
        statusTitle={"Account creation failed"}
        status={requestError}
        type="error"
        onClick={handleAlertModalClose}
      />
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
            Welcome at CARUS
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Name"
                variant="outlined"
                onChange={(event) =>
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
                required
                fullWidth
                id="surname"
                label="Surname"
                variant="outlined"
                onChange={(event) =>
                  inputHandler(
                    event.target.id,
                    event.target.value,
                    setSurnameError,
                    "OnlyLetterInput"
                  )
                }
                error={surnameError}
                helperText={surnameError && "Please enter only letters."}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="street"
                label="Street"
                variant="outlined"
                onChange={(event) =>
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
                required
                fullWidth
                id="houseNumber"
                label="House Number"
                variant="outlined"
                onChange={(event) =>
                  inputHandler(
                    event.target.id,
                    event.target.value,
                    sethouseNumberError,
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
                required
                fullWidth
                id="zipCode"
                label="ZIP Code"
                variant="outlined"
                onChange={(event) =>
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
                required
                fullWidth
                id="city"
                label="City"
                variant="outlined"
                onChange={(event) =>
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
                required
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
            <Grid item xs={12} sm={6}>
              <FormControl required fullWidth variant="outlined">
                <InputLabel
                  error={passwordError}
                  style={{ color: passwordError ? "#d32f2f" : undefined }}
                >
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setPasswordError,
                      "PasswordInput"
                    )
                  }
                  error={passwordError}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {passwordError && (
                  <FormHelperText error style={{ color: "#d32f2f" }}>
                    Password requires min. 12 characters
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl required fullWidth variant="outlined">
                <InputLabel
                  htmlFor="secondPassword"
                  error={secondPasswordError}
                  style={{ color: secondPasswordError ? "#d32f2f" : undefined }}
                >
                  Re-enter password
                </InputLabel>
                <OutlinedInput
                  id="secondPassword"
                  type={showPassword ? "text" : "password"}
                  onChange={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setSecondPasswordError,
                      "ReenteredPasswordInput"
                    )
                  }
                  error={secondPasswordError}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Re-enter password"
                />
                {secondPasswordError && (
                  <FormHelperText error style={{ color: "#d32f2f" }}>
                    Passwords are not identical
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            onClick={handleCreateAccount}
            disabled={!state.isValid}
            sx={{ mt: 5, mb: 2, width: "50%" }}
          >
            Create Account
          </Button>
          {isLoading && (
            <Backdrop open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default SignUpForm;
