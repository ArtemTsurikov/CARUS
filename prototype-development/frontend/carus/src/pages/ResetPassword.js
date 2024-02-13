import * as React from "react";
import { useParams } from "react-router-dom";
import NavBarNew from "../components/Navigation/NavBar";
import Footer from "../components/Navigation/Footer";
import {
  Typography,
  Grid,
  Box,
  Container,
  Button,
  CircularProgress,
  Backdrop,
  FormControl,
  InputLabel,
    InputAdornment,
    IconButton,
    OutlinedInput,
    FormHelperText
} from "@mui/material";
import AlertModal from "../components/AlertModal";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useHistory } from "react-router-dom";


// Initial state of the signup form
const initialState = {
  inputs: {
    password: { value: "", isValid: false },
  },
  isValid: false,
};

const defaultTheme = createTheme();

const ResetPassword = () => {
    const history = useHistory();

    const [alertModal, setAlertModal] = React.useState({
        open: false,
        statusTitle: null,
        status: null,
        type: null,
      });
    
  const token  = useParams().token;

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  // Show/Hide password
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [passwordError, setPasswordError] = React.useState(false);

  const handleAlertModalClose = () => {
    setAlertModal(false);
    resetError();
    if(alertModal.type === "success"){
        history.push("/login");
    }
  };

  // Account creation handler
  const handlePasswordSubmission = async (event) => {
    event.preventDefault();

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/auth/passwordReset/" + token,
        "POST",
        JSON.stringify({
            password: state.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setAlertModal({
        open: true,
        statusTitle: "Password reset successful",
        status: "Your password has been reset. Please login with your new password.",
        type: "success",
      });
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Password reset failed",
        status: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      <NavBarNew />
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <Container sx={{ py: 5 }} maxWidth="xl" disableGutters>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            Password Recovery
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ pb: 3 }}
          >
            Please enter your new strong password and remember it next time
          </Typography>
          <AlertModal
            open={alertModal.open}
            statusTitle={alertModal.statusTitle}
            status={alertModal.status}
            type={alertModal.type}
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
              <Grid container justifyContent="center">
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
              </Grid>
              <Button
                type="submit"
                variant="contained"
                onClick={handlePasswordSubmission}
                disabled={!state.isValid}
                sx={{ mt: 5, mb: 2, width: "50%" }}
              >
                Submit Request
              </Button>
              {isLoading && (
                <Backdrop open={true}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </Box>
          </Container>
        </Container>
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default ResetPassword;
