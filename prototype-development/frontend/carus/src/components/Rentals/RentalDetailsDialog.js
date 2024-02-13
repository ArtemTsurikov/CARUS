import * as React from "react";
import { useHttpClient } from "../../hooks/http-hook";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import { useParams } from "react-router-dom";
import AlertModal from "../AlertModal";
import RentalRequestFormSummary from "./RentalRequestSummary";
import CloseIcon from "@mui/icons-material/Close";
import RentalReviewDialog from "./RentalReviewDialog";
import {
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Grid,
} from "@mui/material";

/* Initial state of the rental request dialog */
const initialState = {
  inputs: {
    sharerName: { value: "", isValid: false },
    renterName: { value: "", isValid: false },
    carModel: { value: "", isValid: false },
    insuranceName: { value: "", isValid: false },
    rentalStartDateTime: { value: "", isValid: false },
    rentalEndDateTime: { value: "", isValid: false },
    additionalInformation: { value: "", isValid: false },
    totalPrice: { value: "", isValid: false },
  },
  isValid: false,
};

const RentalDetailsDialog = (props) => {
  const auth = React.useContext(AuthContext);
  const requestId = useParams()._requestId;

  /* Important consts to pass to child component */
  const [sharerId, setSharerId] = React.useState();
  const [renterId, setRenterId] = React.useState();
  const [rentalId, setRentalId] = React.useState();
  const [carId, setCarId] = React.useState();

  /* Important hooks to determine which buttons are shown */
  const [viewerIsOwner, setViewerIsOwner] = React.useState(false);
  const [requestEditable, setRequestEditable] = React.useState(false);
  const [reviewMode, setReviewMode] = React.useState(false);
  const [reviewedByRenter, setReviewedByRenter] = React.useState(false);
  const [reviewedBySharer, setReviewedBySharer] = React.useState(false);

  const [reviewDialog, serReviewDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { requestError, sendRequest, resetError } = useHttpClient();

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

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchRentalRequestData();
    }
  }, [auth, props.open]);

  const handleAlertModalClose = () => {
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  const fetchRentalRequestData = async () => {
    setIsLoading(true);

    try {
      /* Fetch Rental request */
      const res = await sendRequest(
        "http://localhost:5000/api/carRequest/" +
          (props.carRequestId ? props.carRequestId : requestId),
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      /* Set the data that will be passed by props to child */
      setSharerId(res.carRequest.receivingUser);
      setRenterId(res.carRequest.requestingUser);
      setCarId(res.carRequest.car);

      /* Fetch the Offer */
      const resOffer = await sendRequest(
        "http://localhost:5000/api/carOffer/" + res.carRequest.carOffer,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      /* Fetch the renter */
      const resRenter = await sendRequest(
        "http://localhost:5000/api/user/getUser/" +
          res.carRequest.requestingUser,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      /* Fetch the sharer */
      const resSharer = await sendRequest(
        "http://localhost:5000/api/user/getUser/" +
          res.carRequest.receivingUser,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      /* Fetch the car model */
      const resCarModel = await sendRequest(
        "http://localhost:5000/api/car/getCar/" + res.carRequest.car,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      /* Fetch the insurance */
      const resInsurance = await sendRequest(
        "http://localhost:5000/api/insurance/" + res.carRequest.insurance,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      /* Use form hook to set the fetched data in the form */
      inputHandler(
        "renterName",
        resRenter.user.firstName + " " + resRenter.user.lastName,
        setError
      );
      inputHandler(
        "sharerName",
        resSharer.user.firstName + " " + resSharer.user.lastName,
        setError
      );
      inputHandler(
        "carModel",
        resCarModel.car.carBrand + " " + resCarModel.car.carModel,
        setError
      );
      inputHandler(
        "insuranceName",
        resInsurance.insurance.packageName,
        setError
      );
      inputHandler(
        "rentalStartDateTime",
        res.carRequest.requestStartDateTime,
        setError,
        "StartDateTimeInput"
      );
      inputHandler(
        "rentalEndDateTime",
        res.carRequest.requestEndDateTime,
        setError,
        "EndDateTimeInput"
      );
      inputHandler(
        "additionalInformation",
        res.carRequest.additionalInformation,
        setError
      );

      /* Determine who is willing to see the details (renter or sharer) and calculate the correct price */
      if (res.carRequest.requestingUser === auth.userId) {
        setViewerIsOwner(true);
        inputHandler("totalPrice", res.carRequest.totalRentalAmount, setError);
      } else {
        /* Determine Sharer earnings */
        const startTime = new Date(res.carRequest.requestStartDateTime);
        const endTime = new Date(res.carRequest.requestEndDateTime);
        const durationInHours =
          (endTime.getTime() - startTime.getTime()) / 3600000;
        inputHandler(
          "totalPrice",
          Number(durationInHours * resOffer.carOffer.pricePerHour).toFixed(2),
          setError
        );
      }

      /* Determine whether the request is editable (can be cacelled/updated, accepted/declined) */
      if (res.carRequest.carRequestStatus === "Pending") {
        setRequestEditable(true);
      }

      /* Determine whether reviews can be submitted */
      if (res.carRequest.rental) {
        setRentalId(res.carRequest.rental);
        const resRental = await sendRequest(
          "http://localhost:5000/api/rental/" + res.carRequest.rental,
          "GET",
          undefined,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        if (resRental.rental.rentalStatus === "Finished") {
          setReviewMode(true);
          setReviewedByRenter(resRental.rental.reviewedByRenter);
          setReviewedBySharer(resRental.rental.reviewedBySharer);
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setAlertModal({
        open: true,
        statusTitle: "Failed to fetch rental data",
        status: error.message,
        type: "error",
      });
    }
  };
  const updateRentalRequest = async () => {
    try {
      /* Update Rental request */
      await sendRequest(
        "http://localhost:5000/api/carRequest/updateRequest",
        "POST",
        JSON.stringify({
          carRequestID: props.carRequestId ? props.carRequestId : requestId,
          additionalInformation: state.inputs.additionalInformation.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.close();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Failed to cancel the rental request",
        status: error.message,
        type: "error",
      });
    }
  };
  const cancelRentalRequest = async () => {
    try {
      /* Cancel rental request */
      await sendRequest(
        "http://localhost:5000/api/carRequest/cancelRequest/" +
          (props.carRequestId ? props.carRequestId : requestId),
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.close();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Failed to cancel the rental request",
        status: error.message,
        type: "error",
      });
    }
  };
  const acceptRentalRequest = async () => {
    try {
      /* Accept Rental request */
      await sendRequest(
        "http://localhost:5000/api/carRequest/updateRequestStatus",
        "POST",
        JSON.stringify({
          user: auth.userId,
          carRequestID: props.carRequestId ? props.carRequestId : requestId,
          carRequestStatus: "Accepted",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.close();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Failed to accept the rental request",
        status: error.message,
        type: "error",
      });
    }
  };
  const declineRentalRequest = async () => {
    try {
      /* Decline rental request */
      await sendRequest(
        "http://localhost:5000/api/carRequest/updateRequestStatus",
        "POST",
        JSON.stringify({
          user: auth.userId,
          carRequestID: props.carRequestId ? props.carRequestId : requestId,
          carRequestStatus: "Declined",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.close();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Failed to decline the rental request",
        status: error.message,
        type: "error",
      });
    }
  };
  const handleReviewDialog = () => {
    serReviewDialog(!reviewDialog);
  };

  return (
    <React.Fragment>
      {isLoading && (
        <Backdrop open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <AlertModal
        open={alertModal.open}
        statusTitle={alertModal.statusTitle}
        status={alertModal.status}
        type={alertModal.type}
        onClick={handleAlertModalClose}
      />
      <RentalReviewDialog
        open={reviewDialog}
        close={handleReviewDialog}
        parentClose={props.close}
        viewerIsOwner={viewerIsOwner}
        renter={renterId}
        sharer={sharerId}
        rentalId={rentalId}
        carId={carId}
      />
      <Dialog open={props.open}>
        <IconButton
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={props.close}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <Typography variant="h5" align="center" sx={{ pt: 3 }}>
            Rental Request Summary
          </Typography>
          <RentalRequestFormSummary
            data={state}
            updateData={inputHandler}
            dialogMode={true}
            editorMode={viewerIsOwner}
            requestEditable={requestEditable}
          />
          {viewerIsOwner ? (
            <div>
              {requestEditable && (
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={cancelRentalRequest}
                      fullWidth
                      variant="contained"
                      color="error"
                      type="warning"
                    >
                      Cancel Request
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      onClick={updateRentalRequest}
                      fullWidth
                      variant="contained"
                    >
                      Update Request
                    </Button>
                  </Grid>
                </Grid>
              )}
              {reviewMode && !requestEditable && !reviewedByRenter && (
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={12}>
                    <Button
                      onClick={handleReviewDialog}
                      fullWidth
                      variant="contained"
                    >
                      Leave Review
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          ) : (
            <div>
              {requestEditable && (
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      color = "error"
                      type= "warning"
                      variant="contained"
                      onClick={declineRentalRequest}
                    >
                      Decline Request
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={acceptRentalRequest}
                    >
                      Accept Request
                    </Button>
                  </Grid>
                </Grid>
              )}
              {reviewMode && !requestEditable && !reviewedBySharer && (
                <Grid container spacing={2} alignItems={"center"}>
                  <Grid item xs={12} sm={12}>
                    <Button
                      onClick={handleReviewDialog}
                      fullWidth
                      variant="contained"
                    >
                      Leave Review
                    </Button>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default RentalDetailsDialog;
