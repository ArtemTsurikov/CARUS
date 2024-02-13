import * as React from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import AlertModal from "../AlertModal";
import {
  Typography,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
  Rating,
  Container,
  Box,
  TextField,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const initialStateRenterReview = {
  inputs: {
    sharerReviewTitle: { value: "", isValid: false },
    sharerRating: { value: "", isValid: false },
    sharerReview: { value: "", isValid: false },
    carReviewTitle: { value: "", isValid: false },
    carRating: { value: "", isValid: false },
    carReview: { value: "", isValid: false },
  },
  isValid: false,
};

const initialStateSharerReview = {
  inputs: {
    renterReviewTitle: { value: "", isValid: false },
    renterRating: { value: "", isValid: false },
    renterReview: { value: "", isValid: false }
  },
  isValid: false,
};

const RentalReviewDialog = (props) => {
  const auth = React.useContext(AuthContext);

  const {requestError, sendRequest, resetError } = useHttpClient();

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  const [stateRenterReview, inputHandlerRenterReview] = useForm(
    initialStateRenterReview.inputs,
    initialStateRenterReview.isValid
  );

  const [stateSharerReview, inputHandlerSharerReview] = useForm(
    initialStateSharerReview.inputs,
    initialStateSharerReview.isValid
  );

  const [error, setError] = React.useState(false);
  const [sharerReviewTitleError, setSharerReviewTitleError] = React.useState(false);
  const [renterReviewTitleError, setRenterReviewTitleError] = React.useState(false);
  const [carReviewTitleError, setCarReviewTitleError] = React.useState(false);
  const [sharerReviewError, setSharerReviewError] = React.useState(false);
  const [carReviewError, setCarReviewError] = React.useState(false);
  const [renterReviewError, setRenterReviewError] = React.useState(false);

  const handleAlertModalClose = () => {
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
    if(alertModal.type === "success"){
      props.close();
      props.parentClose();
    }
  };

  const leaveReviewAsRenter = async () => {
    try {
      //Renter creates a review for the sharer
      await sendRequest(
        "http://localhost:5000/api/review/reviewUser",
        "POST",
        JSON.stringify({
          title: stateRenterReview.inputs.sharerReviewTitle.value,
          content: stateRenterReview.inputs.sharerReview.value,
          rating: stateRenterReview.inputs.sharerRating.value,
          reviewedUser: props.sharer,
          reviewingUser: auth.userId,
          rental: props.rentalId
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      //Renter creates a review for the rented car
      await sendRequest(
        "http://localhost:5000/api/review/reviewCar",
        "POST",
        JSON.stringify({
          title: stateRenterReview.inputs.carReviewTitle.value,
          content: stateRenterReview.inputs.carReview.value,
          rating: stateRenterReview.inputs.carRating.value,
          car: props.carId,
          reviewedUser: props.sharer,
          reviewingUser: auth.userId,
          rental: props.rentalId
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setAlertModal({
        open: true,
        statusTitle: "Review submitted",
        status: "You have successfully submitted your review",
        type: "success",
      });
      } catch (error) {
        setAlertModal({
          open: true,
          statusTitle: "Failed to submit review",
          status: error.message,
          type: "error",
        });
      }
  };

  const leaveReviewAsSharer = async () => {
    try {
      //Sharer creates a review for the renter
      await sendRequest(
        "http://localhost:5000/api/review/reviewUser",
        "POST",
        JSON.stringify({
          title: stateSharerReview.inputs.renterReviewTitle.value,
          content: stateSharerReview.inputs.renterReview.value,
          rating: stateSharerReview.inputs.renterRating.value,
          reviewedUser: props.renter,
          reviewingUser: auth.userId,
          rental: props.rentalId
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAlertModal({
        open: true,
        statusTitle: "Review submitted",
        status: "You have successfully submitted your review",
        type: "success",
      });
      } catch (error) {
        setAlertModal({
          open: true,
          statusTitle: "Failed to submit review",
          status: error.message,
          type: "error",
        });
      }
  };

  return (
    <React.Fragment>
      <AlertModal
        open={alertModal.open}
        statusTitle={alertModal.statusTitle}
        status={alertModal.status}
        type={alertModal.type}
        onClick={handleAlertModalClose}
      />
      <Dialog open={props.open}>
        <IconButton
          onClick={props.close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Container maxWidth="md">
            {props.viewerIsOwner ? (
              <div>
                <Box
                  sx={{
                    my: 4,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={3} alignItems={"center"}>
                    <Grid item align="center" xs={12}>
                      <Typography variant="h5" align="center">
                        Your experience with the sharer
                      </Typography>
                    </Grid>
                    <Grid item align="center" xs={12}>
                      <Rating
                        id="sharerRating"
                        size="large"
                        onChange={(event, newValue) => {
                          inputHandlerRenterReview(
                            "sharerRating",
                            newValue,
                            setError,
                            "StartDateTimeInput"
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="sharerReviewTitle"
                      variant="outlined"
                      label="Review title"
                      error={sharerReviewTitleError}
                      onChange={(event) =>
                        inputHandlerRenterReview(
                          event.target.id,
                          event.target.value,
                          setSharerReviewTitleError
                        )
                      }
                    />
                     </Grid>
                     <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="sharerReview"
                        variant="outlined"
                        label="Please share your renting experience with us"
                        multiline
                        error={sharerReviewError}
                        onChange={(event) =>
                          inputHandlerRenterReview(
                            event.target.id,
                            event.target.value,
                            setSharerReviewError
                          )
                        }
                      ></TextField>
                    </Grid>
                  </Grid>
                </Box>

                <Divider variant="middle" sx={{ borderBottomWidth: 2 }} />

                <Box
                  sx={{
                    my: 4,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Grid container spacing={3} alignItems={"center"}>
                    <Grid item align="center" xs={12}>
                      <Typography variant="h5" align="center">
                        Your driving experience
                      </Typography>
                    </Grid>
                    <Grid item align="center" xs={12}>
                      <Rating
                        id="carRating"
                        size="large"
                        onChange={(event, newValue) => {
                          inputHandlerRenterReview(
                            "carRating",
                            newValue,
                            setError,
                            "StartDateTimeInput"
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="carReviewTitle"
                      variant="outlined"
                      label="Review title"
                      error={carReviewTitleError}
                      onChange={(event) =>
                        inputHandlerRenterReview(
                          event.target.id,
                          event.target.value,
                          setCarReviewError
                        )
                      }
                    />
                     </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="carReview"
                        variant="outlined"
                        label="Please share your driving experience with us"
                        multiline
                        error={carReviewError}
                        onChange={(event) =>
                          inputHandlerRenterReview(
                            event.target.id,
                            event.target.value,
                            setCarReviewError
                          )
                        }
                      ></TextField>
                    </Grid>
                  </Grid>
                  <Button
                    variant="contained"
                    sx={{ mt: 3, width: "50%" }}
                    onClick={leaveReviewAsRenter}
                    disabled={!stateRenterReview.isValid}
                  >
                    Submit review
                  </Button>
                </Box>
              </div>
            ) : (
              <Box
                sx={{
                  my: 4,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={3} alignItems={"center"}>
                  <Grid item align="center" xs={12}>
                    <Typography variant="h5" align="center">
                      Your experience with the renter
                    </Typography>
                  </Grid>
                  <Grid item align="center" xs={12}>
                    <Rating
                      id="renterRating"
                      size="large"
                      onChange={(event, newValue) => {
                        inputHandlerSharerReview(
                          "renterRating",
                          newValue,
                          setError,
                          "StartDateTimeInput"
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="renterReviewTitle"
                      variant="outlined"
                      label="Review title"
                      error={renterReviewTitleError}
                      onChange={(event) =>
                        inputHandlerSharerReview(
                          event.target.id,
                          event.target.value,
                          setRenterReviewTitleError
                        )
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="renterReview"
                      variant="outlined"
                      label="Please share your renter experience with us"
                      multiline
                      error={renterReviewError}
                      onChange={(event) =>
                        inputHandlerSharerReview(
                          event.target.id,
                          event.target.value,
                          setRenterReviewError
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Button
                  variant="contained"
                  sx={{ mt: 3, width: "50%" }}
                  onClick={leaveReviewAsSharer}
                  disabled={!stateSharerReview.isValid}
                >
                  Submit review
                </Button>
              </Box>
            )}
          </Container>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default RentalReviewDialog;
