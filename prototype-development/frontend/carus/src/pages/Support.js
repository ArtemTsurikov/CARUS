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
    firstName: { value: "", isValid: false },
    lastName: { value: "", isValid: false },
    email: { value: "", isValid: false },
    message: { value: "", isValid: false},
},
    isValid: false,
};


const defaultTheme = createTheme();

const Support = () => {

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
    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [messageError, setMessageError] = React.useState(false);

    const handleAlertModalClose = () => {
        setAlertModal(false);
        resetError();
        if(alertModal.type === "success"){
            history.push("/whyCarus");
        }
      };
    
    // Request submission handler
    const handleRequestSubmission = async (event) => {
        event.preventDefault();
    
        try {
          const res = await sendRequest(
            "http://localhost:5000/api/support/contact",
            "POST",
            JSON.stringify({
              firstName: state.inputs.firstName.value,
              lastName: state.inputs.lastName.value,
              email: state.inputs.email.value,
              message: state.inputs.message.value,
            }),
            {
              "Content-Type": "application/json",
            }
          );
        setAlertModal({
            open: true,
            statusTitle: "Support request sent",
            status: "Your request has been sent to our customer support team. We will get back to you as soon as possible.",
            type: "success",
          });
        } catch (error) {
          setAlertModal({
            open: true,
            statusTitle: "Support request failed",
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
                        Carus - Share Mobility: Customer Support
                    </Typography>
                    <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{pb: 3}}>
                        We are here to help you with any questions you may have about our services. <br />
                        Our customer support team is available 24/7.
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
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="Frist Name"
                                    variant="outlined"
                                    onChange={(event) =>
                                        inputHandler(
                                        event.target.id,
                                        event.target.value,
                                        setFirstNameError,
                                        "OnlyLetterInput"
                                        )
                                    }
                                    error={firstNameError}
                                    helperText={firstNameError && "Please enter only letters."}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    variant="outlined"
                                    onChange={(event) =>
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
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                    required
                                    fullWidth
                                    multiline
                                    rows={10}
                                    id="message"
                                    label="Please describe your issue..."
                                    variant="outlined"
                                    onChange={(event) =>
                                        inputHandler(
                                        event.target.id,
                                        event.target.value,
                                        setMessageError,
                                        "NotEmpty"
                                        )
                                    }
                                    error={messageError}
                                    helperText={messageError && "Please enter your message."}
                                    />
                                </Grid>
                            </Grid>
                            <Button
                            type="submit"
                            variant="contained"
                            onClick={handleRequestSubmission}
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

export default Support;