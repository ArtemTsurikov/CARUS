import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useForm } from "../hooks/form-hook";
import AlertModal from "../components/AlertModal";
import Footer from "../components/Navigation/Footer";
import RentalRequestDetailsForm from "../components/Rentals/RentalRequestDetailsForm";
import RentalRequestFormSummary from "../components/Rentals/RentalRequestSummary";
import RentalRequestSuccessFailure from "../components/Rentals/RentalRequestSuccessFailure";
import {
  Typography,
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const initialState = {
  inputs: {
    sharerName: { value: "", isValid: false },
    sharerId: { value: "", isValid: false },
    renterName: { value: "", isValid: false },
    renterId: { value: "", isValid: false },
    carModel: { value: "", isValid: false },
    carId: { value: "", isValid: false },
    carOffer: { value: "", isValid: false },
    insurance: { value: "", isValid: false },
    insuranceName: { value: "", isValid: false },
    rentalStartDateTime: { value: "", isValid: false },
    rentalEndDateTime: { value: "", isValid: false },
    additionalInformation: { value: "", isValid: false },
    totalPrice: { value: "", isValid: false },
    termsAccepted: { value: false, isValid: false },
  },
  isValid: false,
};

const RentalRequestPage = (props) => {
  const auth = React.useContext(AuthContext);
  const carOfferId = useParams()._id;
  const [isLoading, setIsLoading] = React.useState(false);

  const {requestError, sendRequest, resetError } = useHttpClient();

  const [activeStep, setActiveStep] = React.useState(0);

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  /* 
  Steps of the rental request
  */
  const steps = [
    "Enter Rental Details",
    "Review Request",
    "Enter Payment Details",
    "Submit Request",
  ];

  const paymentInfo =
    "In the next step you will provide your payment details. " +
    "Your card will be charged, once the car offerer accepted your request.";

  /* 
  Hook to update the form
  */
  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );
  const [error, setError] = React.useState(false);

  /* TODO: Prevent data loss when reloading page */
  React.useEffect(async () => {
    if (auth.isLoggedIn) {
      /* 
      Decision whether to load the data from the passed prop or the local storage
      */
      if (props.success === true) {
        reloadRequestDetails();
        setActiveStep(3);
      } else if (props.success === false) {
        reloadRequestDetails();
        setActiveStep(2);
      } else {
        await fetchRentalData();
      }
    }
  }, [auth]);

  const handleAlertModalClose = () => {
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  const showPaymentInfo = () => {
    setAlertModal({
      open: true,
      statusTitle: "Information about the payment",
      status: paymentInfo,
      type: "info",
    });
  };

  const requestRental = async () => {
    setIsLoading(true);
    const presentCheckoutSession = JSON.parse(
      localStorage.getItem("checkoutSession")
    );
    const presentRequestData = JSON.parse(
      localStorage.getItem("rentalRequestData")
    );

    try {
      //Fetch the payment checkout session from stripe
      const res = await sendRequest(
        "http://localhost:5000/api/carRequest/createRequest",
        "POST",
        JSON.stringify({
          car: presentRequestData.state.inputs.carId.value,
          carOffer: presentRequestData.state.inputs.carOffer.value,
          insurance: presentRequestData.state.inputs.insurance.value,
          receivingUser: presentRequestData.state.inputs.sharerId.value,
          requestingUser: auth.userId,
          requestStartDateTime:
            presentRequestData.state.inputs.rentalStartDateTime.value +"Z",
          requestEndDateTime:
            presentRequestData.state.inputs.rentalEndDateTime.value +"Z",
          checkoutSession: presentCheckoutSession.checkoutSession,
          additionalInformation:
            presentRequestData.state.inputs.additionalInformation.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setIsLoading(false);
      handleNext();
    } catch (error) {
      setIsLoading(false);
      setAlertModal({
        open: true,
        statusTitle: "Failed to request rental",
        status: error.message,
        type: "error",
      });
    }
  };

  /* 
  Handle the entering of the customer payment details
  Happens when the customer confirms the entered request details
  */
  const handlePaymentCheckout = async () => {
    setIsLoading(true);
    try {
      /* Fetch the payment checkout session from stripe */
      const res = await sendRequest(
        "http://localhost:5000/api/carRequest/create-checkout-session",
        "POST",
        JSON.stringify({
          car: state.inputs.carId.value,
          carOffer: state.inputs.carOffer.value,
          insurance: state.inputs.insurance.value,
          receivingUser: state.inputs.sharerId.value,
          requestingUser: auth.userId,
          requestStartDateTime: state.inputs.rentalStartDateTime.value+"Z",
          requestEndDateTime: state.inputs.rentalEndDateTime.value+"Z",
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setIsLoading(false);

      const checkoutSession = res.url.split("/").pop().split("#")[0];
      /* Save rental request data from the form to local browser storage */
      localStorage.setItem("rentalRequestData", JSON.stringify({ state }));
      /* Save the checkout session id to local browser storage */
      localStorage.setItem(
        "checkoutSession",
        JSON.stringify({ checkoutSession: checkoutSession })
      );

      /* Redirect to stripe payment details form */
      window.location = res.url;
    } catch (error) {
      setIsLoading(false);
      setAlertModal({
        open: true,
        statusTitle: "Failed to create payment session",
        status: error.message,
        type: "error",
      });
    }
  };

  /* 
  Loads the request details from the local storage. 
  Happens when the payment processing failed 
  */
  const reloadRequestDetails = async () => {
    const presentData = JSON.parse(localStorage.getItem("rentalRequestData"));
    if (presentData !== null) {
      for (const item in presentData.state.inputs) {
        if (item !== "termsAccepted") {
          inputHandler(item, presentData.state.inputs[item].value, setError);
        }
      }
    }
    await fetchPrice();
  };

  /* 
  Removes the request details and the checkput session from the local storage. 
  Happens when the customer quits the rental request process
  */
  const deleteRentalRequestDetails = () => {
    localStorage.removeItem("rentalRequestData");
    localStorage.removeItem("checkoutSession");
  };

  /* 
  Handles the next step of the Stepper component
  */
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  /* 
  Handles the previous step of the Stepper component
  */
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  /* 
  Fetches all relevant data for creating a rental request and prefilling the form.
  Happens when the customer initially loads the rental request page
  */
  const fetchRentalData = async () => {
    setIsLoading(true);
    try {
      //Fetch Car Offer
      const resCarOffer = await sendRequest(
        "http://localhost:5000/api/carOffer/" + carOfferId,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      inputHandler(
        "rentalStartDateTime",
        resCarOffer.carOffer.offerStartDateTime.substring(0,resCarOffer.carOffer.offerStartDateTime.length - 1),
        setError,
        "StartDateTimeInput"
      );

      inputHandler(
        "rentalEndDateTime",
        resCarOffer.carOffer.offerEndDateTime.substring(0,resCarOffer.carOffer.offerEndDateTime.length - 1),
        setError,
        "EndDateTimeInput"
      );

      //Fetch Renter Name
      const resRenter = await sendRequest(
        "http://localhost:5000/api/user/getUser/" + auth.userId,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      inputHandler(
        "renterName",
        resRenter.user.firstName + " " + resRenter.user.lastName,
        setError
      );
      inputHandler("renterId", resRenter.user._id, setError);

      //Fetch Sharer Name
      const resSharer = await sendRequest(
        "http://localhost:5000/api/user/getUser/" + resCarOffer.carOffer.user,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      inputHandler(
        "sharerName",
        resSharer.user.firstName + " " + resSharer.user.lastName,
        setError
      );
      inputHandler("sharerId", resSharer.user._id, setError);

      //Fetch Car Name
      const resCarModel = await sendRequest(
        "http://localhost:5000/api/car/getCar/" + resCarOffer.carOffer.car,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      inputHandler(
        "carModel",
        resCarModel.car.carBrand + " " + resCarModel.car.carModel,
        setError
      );

      inputHandler("carId", resCarModel.car._id, setError);

      inputHandler("carOffer", carOfferId, setError);
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

  /* 
  Fetches the price of the insurance based on the selection in the form
  */
  const fetchInsuranceId = async (name) => {
    setIsLoading(true);
    try {
      //Fetch Insurance Id by insurance name
      const resInsurance = await sendRequest(
        "http://localhost:5000/api/insurance/byName/" + name,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      inputHandler("insurance", resInsurance.insuranceId, setError);
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

  /* 
  Passes the preselected form data to the backend and fetches the rental price.
  */
  const fetchPrice = async () => {
    console.log(state)
    if (
      state.inputs.insurance.isValid !== false &&
      state.inputs.rentalStartDateTime.isValid !== false &&
      state.inputs.rentalEndDateTime.isValid !== false
    ) {
      setIsLoading(true);
      try {
        //Fetch the new price
        const res = await sendRequest(
          "http://localhost:5000/api/carRequest/determinePrice",
          "POST",
          JSON.stringify({
            carOffer: state.inputs.carOffer.value,
            insurance: state.inputs.insurance.value,
            requestStartDateTime: state.inputs.rentalStartDateTime.value+"Z",
            requestEndDateTime: state.inputs.rentalEndDateTime.value+"Z",
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        inputHandler("totalPrice", res.totalPrice, setError);
        setIsLoading(false);
        handleNext();
      } catch (error) {
        setIsLoading(false);
        setAlertModal({
          open: true,
          statusTitle: "Failed to determine rental price",
          status: error.message,
          type: "error",
        });
      }
    }
  };

  /* 
  Renders the correct component depending in the active step
  */
  const getStepComponent = (step) => {
    switch (step) {
      case 0:
        return (
          <RentalRequestDetailsForm
            data={state}
            updateData={inputHandler}
            determineInsurance={fetchInsuranceId}
          />
        );
      case 1:
        return (
          <RentalRequestFormSummary
            data={state}
            updateData={inputHandler}
            editorMode={true}
          />
        );
      case 2:
        return <RentalRequestSuccessFailure success={false} />;
      case 3:
        return <RentalRequestSuccessFailure success={true} />;
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <React.Fragment>
      <NavBarNew />
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
        onConfirmCheckout={handlePaymentCheckout}
      />
      <Container maxWidth="md">
        <Typography variant="h4" align="center" sx={{ p: 3 }}>
          Rental Request
        </Typography>

        <Stepper activeStep={activeStep} sx={{ pt: 2, pb: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>
                <strong>{label}</strong>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography variant="h5" gutterBottom>
              Thank you for your rental request.
            </Typography>
            <Typography variant="subtitle1">
              We have emailed your rental confirmation, and you will receive an
              update when your rental has been accepted.
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                href={`/profile/${auth.userId}`}
                variant="contained"
                sx={{ mt: 1, ml: 1, mb: 3 }}
                onClick={deleteRentalRequestDetails}
              >
                Back to profile
              </Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {getStepComponent(activeStep)}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {/* Buttons on step 1 */}
              {activeStep === 0 && (
                <Button
                  variant="contained"
                  onClick={fetchPrice}
                  sx={{ mt: 1, ml: 1, mb: 3 }}
                  disabled={
                    !(
                      state.inputs.insurance.isValid !== false &&
                      state.inputs.rentalStartDateTime.isValid !== false &&
                      state.inputs.rentalEndDateTime.isValid !== false &&
                      state.inputs.additionalInformation.isValid !== false
                    )
                  }
                >
                  Next
                </Button>
              )}

              {/* Buttons on step 2 */}
              {activeStep === 1 && (
                <div>
                  <Button onClick={handleBack} sx={{ mt: 1, ml: 1, mb: 3 }}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={showPaymentInfo}
                    sx={{ mt: 1, ml: 1, mb: 3 }}
                    disabled={!state.isValid}
                  >
                    Confirm
                  </Button>
                </div>
              )}
              {/* Buttons on step 3 */}
              {activeStep === 2 && (
                <div>
                  <Button
                    onClick={handleBack}
                    variant="contained"
                    sx={{ mt: 1, ml: 1, mb: 3 }}
                  >
                    Try again
                  </Button>
                  <Button
                    href={`/profile/${auth.userId}`}
                    onClick={deleteRentalRequestDetails}
                    variant="contained"
                    sx={{ mt: 1, ml: 1, mb: 3 }}
                  >
                    Back to profile
                  </Button>
                </div>
              )}
              {/* Buttons on step 4 */}
              {activeStep === 3 && (
                <Button
                  variant="contained"
                  sx={{ mt: 1, ml: 1, mb: 3 }}
                  onClick={requestRental}
                  //onClick={pay}
                >
                  Submit Request
                </Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Container>
    </React.Fragment>
  );
};

export default RentalRequestPage;
