import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import Footer from "../components/Navigation/Footer";
import {
    Typography,
    Grid,
    Box,
    TextField,
    Container,
    Button,
    CircularProgress,
    Backdrop,
  } from "@mui/material";
import AlertModal from "../components/AlertModal";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useHistory } from "react-router-dom";


// Initial state of the signup form
const initialState = {
inputs: {
    email: { value: "", isValid: false },
},
    isValid: false,
};


const defaultTheme = createTheme();

const ForgotPassword = () => {

    const history = useHistory();

    const [alertModal, setAlertModal] = React.useState({
        open: false,
        statusTitle: null,
        status: null,
        type: null,
      });
  
    const [state, inputHandler] = useForm(
      initialState.inputs,
      initialState.isValid
    );
    const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  
    // User input errors
    const [emailError, setEmailError] = React.useState(false);

    const handleAlertModalClose = () => {
        setAlertModal(false);
        resetError();
        if(alertModal.type === "success"){
            history.push("/login");
        }
      };
    
      // Account creation handler
      //TODO: implement email submission to admin
    const handlePasswordSubmission = async (event) => {
        event.preventDefault();
      
        try {
          const res = await sendRequest(
            "http://localhost:5000/api/auth/passwordResetLink",
            "POST",
            JSON.stringify({
              email: state.inputs.email.value,
            }),
            {
              "Content-Type": "application/json",
            }
            //TODO: reroute to login page
          );
          setAlertModal({
            open: true,
            statusTitle: "Password reset link sent",
            status: "Please check your email for a password reset link.",
            type: "success",
          });
        } catch (error) {
          setAlertModal({
            open: true,
            statusTitle: "Password reset link not sent",
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
                <Container sx={{ py: 5 }} maxWidth="xl" disableGutters >
                    <Typography
                        component="h2"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                        >
                        Password Recovery
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{pb: 3}}>
                        Please enter your email address and we will send you a password recovery link.
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
                            <Grid container>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Please enter your email address"
                                    variant="outlined"
                                    onChange={(event) =>
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

export default ForgotPassword;