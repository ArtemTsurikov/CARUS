import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  OutlinedInput,
  InputAdornment,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useForm } from "../hooks/form-hook";
import AlertModal from "./AlertModal";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import dayjs from "dayjs";
import CloseIcon from "@mui/icons-material/Close";

import * as React from "react";
import { CarContext } from "../context/car-context";

// Initial state of the sharing offer creation form
const initialState = {
  inputs: {
    car: { value: "", isValid: true },
    carId: { value: "", isValid: true },
    pricePerHour: { value: "", isValid: false },
    offerStartDateTime: { value: "", isValid: false },
    offerEndDateTime: { value: "", isValid: false },
    additionalInformation: { value: "", isValid: false },
    termsAccepted: { value: false, isValid: false },
  },
  isValid: false,
};

const SharingOfferDialog = (props) => {
  const auth = React.useContext(AuthContext);
  const { car } = React.useContext(CarContext);

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  const [carError, setCarError] = React.useState(false);
  const [pricePerHourError, setPricePerHourError] = React.useState(false);
  const [offerStartDateTimeError, setOfferStartDateTimeError] =
    React.useState(false);
  const [offerEndDateTimeError, setOfferEndDateTimeError] =
    React.useState(false);
  const [additionalInformationError, setAdditionalInformationError] =
    React.useState(false);
  const [termsAcceptedError, setTermsAcceptedError] = React.useState(false);

  const handleAlertModalClose = () => {
    if (alertModal.type === "success") {
      props.onClick();
    }
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  const handleOfferCreation = async (event) => {
    event.preventDefault();

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/carOffer/createOffer",
        "POST",
        //TODO: Make car ID dynamic
        JSON.stringify({
          car: props.data
            ? props.data.carId
            : props.cars
            ? state.inputs.carId.value
            : car._id,
          user: auth.userId,
          pricePerHour: state.inputs.pricePerHour.value,
          offerStartDateTime: state.inputs.offerStartDateTime.value,
          offerEndDateTime: state.inputs.offerEndDateTime.value,
          additionalInformation: state.inputs.additionalInformation.value,
          termsAccepted: state.inputs.termsAccepted.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onClick();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Sharing offer creation failed",
        status: error.message,
        type: "error",
      });
    }
  };

  const handleOfferUpdate = async (event) => {
    event.preventDefault();
    //Extract all changed values
    const body = Object.entries(state.inputs).reduce((acc, [key, value]) => {
      if (value.value !== "" && value.value !== false) {
        acc[key] = value.value;
      }
      return acc;
    }, {});
    const reqBody = JSON.stringify(body);

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/carOffer/updateOffer/" + props.data._id,
        "POST",
        reqBody,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAlertModal({
        open: true,
        statusTitle: "Sharing offer update succeeded",
        status: "Your sharing offer was updated successfully",
        type: "success",
      });
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Sharing offer update failed",
        status: error.message,
        type: "error",
      });
    }
  };

  const handleDeletionWarning = (event) => {
    event.preventDefault();
    setAlertModal({
      open: true,
      statusTitle: "Warning",
      status: "Are you sure that you want to delete this offer?",
      type: "warning",
    });
  };

  const handleOfferDeletion = async (event) => {
    event.preventDefault();

    try {
      const res = await sendRequest(
        "http://localhost:5000/api/carOffer/" + props.data._id,
        "DELETE",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAlertModal({
        open: true,
        statusTitle: "Sharing offer deletion succeeded",
        status: "Your sharing offer was deleted successfully",
        type: "success",
      });
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Sharing offer deletion failed",
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
        handleDelete={handleOfferDeletion}
      />
      <Dialog open={props.open}>
        <DialogActions>
          <IconButton
            onClick={props.onClick}
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
        <DialogContent>
          <Box
            sx={{
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ pb: 5 }}>
              Car Sharing Offer
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                {/* TODO: Make Dropdown dynamic (fetch user cars) */}
                {car && (
                  <TextField
                    fullWidth
                    label="Brand, Model"
                    value={`${car.carBrand}, ${car.carModel}`}
                  />
                )}
                {props.carModel && (
                  <TextField
                    fullWidth
                    disabled
                    label="Brand, Model"
                    value={props.carModel}
                  />
                )}
                {props.cars && (
                  <FormControl fullWidth required>
                    <InputLabel id="car-label">Brand, Model</InputLabel>
                    <Select
                      fullWidth
                      labelId="car-label"
                      label="Brand, Model"
                      id="carId"
                      defaultValue={
                        state.inputs.car.value !== ""
                          ? state.inputs.car.value
                          : undefined
                      }
                      onChange={(event) => {
                        inputHandler("carId", event.target.value, setCarError);
                      }}
                    >
                      {props.cars.length === 0 ? (
                        <MenuItem key={"No cars available"} value={"1"}>
                          {"No cars available"}
                        </MenuItem>
                      ) : (
                        props.cars.map((nestedArray, index) =>
                          nestedArray.map((option, nestedIndex) => (
                            <MenuItem key={option["_id"]} value={option["_id"]}>
                              {option["carBrand"]} {option["carModel"]}
                            </MenuItem>
                          ))
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel
                    error={pricePerHourError}
                    style={{ color: pricePerHourError ? "#d32f2f" : undefined }}
                  >
                    Price per hour
                  </InputLabel>
                  {!props.data ? (
                    <OutlinedInput
                      id="pricePerHour"
                      endAdornment={
                        <InputAdornment position="end">€</InputAdornment>
                      }
                      label="Price per hour"
                      error={pricePerHourError}
                      onBlur={(event) =>
                        inputHandler(
                          event.target.id,
                          event.target.value,
                          setPricePerHourError,
                          "OnlyNumberInput"
                        )
                      }
                    />
                  ) : (
                    <OutlinedInput
                      id="pricePerHour"
                      defaultValue={props.data.pricePerHour}
                      endAdornment={
                        <InputAdornment position="end">€</InputAdornment>
                      }
                      label="Price per hour"
                      error={pricePerHourError}
                      onBlur={(event) =>
                        inputHandler(
                          event.target.id,
                          event.target.value,
                          setPricePerHourError,
                          "OnlyNumberInput"
                        )
                      }
                    />
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      disabled={props.data ? true : false}
                      disablePast
                      id="offerStartDateTime"
                      label="Choose sharing start time"
                      value={
                        props.data
                          ? dayjs(
                              props.data.offerStartDateTime.substring(
                                0,
                                props.data.offerStartDateTime.length - 1
                              )
                            )
                          : undefined
                      }
                      error={offerStartDateTimeError}
                      onChange={(newValue) =>
                        inputHandler(
                          "offerStartDateTime",
                          newValue,
                          setOfferStartDateTimeError,
                          "StartDateTimeInput"
                        )
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      disabled={props.data ? true : false}
                      id="offerEndDateTime"
                      disablePast
                      label="Choose sharing end time"
                      value={
                        props.data
                          ? dayjs(
                              props.data.offerEndDateTime.substring(
                                0,
                                props.data.offerEndDateTime.length - 1
                              )
                            )
                          : undefined
                      }
                      error={offerEndDateTimeError}
                      onChange={(newValue) =>
                        inputHandler(
                          "offerEndDateTime",
                          newValue,
                          setOfferEndDateTimeError,
                          "EndDateTimeInput"
                        )
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  required
                  id="additionalInformation"
                  label="Additional Information"
                  multiline
                  maxRows={4}
                  variant="outlined"
                  defaultValue={
                    props.data ? props.data.additionalInformation : undefined
                  }
                  error={additionalInformationError}
                  onBlur={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setAdditionalInformationError
                    )
                  }
                />
              </Grid>
              {!props.data && (
                <Grid item xs={12} sm={12}>
                  <FormControlLabel
                    fullWidth
                    required
                    control={
                      <Checkbox
                        id="termsAccepted"
                        error={termsAcceptedError}
                        onChange={(event) =>
                          inputHandler(
                            event.target.id,
                            event.target.checked,
                            setTermsAcceptedError,
                            "CheckmarkInput"
                          )
                        }
                      />
                    }
                    label={
                      <>
                        <span>I hereby agree to the </span>
                        <Typography
                          component="a"
                          href="http://localhost:3000/termsOfService"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          terms and conditions
                        </Typography>
                      </>
                    }
                  />
                </Grid>
              )}
              {!props.data && (
                <Grid item xs={12} sm={12}>
                  <Button
                    fullWidth
                    id="createSharingOffer"
                    variant="contained"
                    onClick={handleOfferCreation}
                    disabled={!state.isValid}
                  >
                    Create Offer
                  </Button>
                </Grid>
              )}
              {props.data && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    id="deleteSharingOffer"
                    variant="contained"
                    type="warning"
                    onClick={handleDeletionWarning}
                    color="error"
                  >
                    Delete Offer
                  </Button>
                </Grid>
              )}

              {props.data && (
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    id="updateSharingOffer"
                    variant="contained"
                    onClick={handleOfferUpdate}
                  >
                    Update Offer
                  </Button>
                </Grid>
              )}
            </Grid>
            {isLoading && (
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SharingOfferDialog;
