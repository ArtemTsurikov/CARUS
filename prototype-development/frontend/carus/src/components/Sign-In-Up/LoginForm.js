import {
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AuthContext } from "../../context/auth-context";
import * as React from "react";
import AlertModal from "../AlertModal";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// Initial state of the login form
const initialState = {
  inputs: {
    email: { value: "", isValid: false },
    password: { value: "", isValid: false },
  },
  isValid: false,
};

const LoginForm = () => {
  const auth = React.useContext(AuthContext);

  const [alertModal, setAlertModal] = React.useState(false);

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const history = useHistory()


  const handleAlertModalClose = () => {
    setAlertModal(false);
    resetError();
  };

  // Signin handler
  const handleSignIn = async (event) => {

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/auth/login",
        "POST",
        JSON.stringify({
          email: state.inputs.email.value,
          password: state.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(res.userId, res.token, res.user);
      history.push(`/profile/${res.userId}`)


    } catch (error) {
      setAlertModal(true);
    }
  };
  return (
    <React.Fragment>
      <AlertModal
        open={alertModal}
        statusTitle={"Login failed"}
        status={requestError}
        type="error"
        onClick={handleAlertModalClose}
      />
      <Grid item sm={12} md={5}>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">Sign in</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              id="email"
              required
              margin="normal"
              fullWidth
              label="Email"
              onChange={(event) =>
                inputHandler(event.target.id, event.target.value, setEmailError)
              }
              error={emailError}
            />
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
                onChange={(event) =>
                  inputHandler(
                    event.target.id,
                    event.target.value,
                    setPasswordError
                  )
                }
                error={passwordError}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Link href="/forgotPassword" variant="body2">
              Forgot password?
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!state.isValid}
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            {isLoading && (
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
            <Divider sx={{ mt: 3, fontSize: 15 }}>New at CARUS?</Divider>
            <Button
              href="/signup"
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 1 }}
            >
              Create a new account
            </Button>
          </Box>
        </Box>
      </Grid>
    </React.Fragment>
  );
};

export default LoginForm;
