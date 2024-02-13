import {
  Typography,
  Grid,
  Box,
  TextField,
  Container,
  IconButton,
  Button,
  MenuItem,
  Dialog,
  DialogActions,
} from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { useState } from "react";
import * as React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { CarContext } from "../../context/car-context";
import AlertModal from "../../components/AlertModal";
import CloseIcon from "@mui/icons-material/Close";

//Used for checkmarks
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// Initial state of the car form
const initialState = {
  inputs: {
    brand: { value: "", isValid: true },
    model: { value: "", isValid: true },
    fuelType: { value: "", isValid: true },
    transmissionType: { value: "", isValid: true },
    averageRange: { value: "", isValid: true },
    carType: { value: "", isValid: true },
    numberOfSeats: { value: 0, isValid: true },
    requiredDrivingLicense: { value: "", isValid: true },
  },
  isValid: false,
};
const CarUpdateForm = (props) => {
  const auth = React.useContext(AuthContext);
  const { car, fetchCar } = React.useContext(CarContext);

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAttributesCar();
    }
  }, [auth]);

  const fromHashTableToArray = (list) => {
    var array = [];
    for (var i in list) {
      array.push(list[i]);
    }
    return array;
  };

  const fetchAttributesCar = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/car/getCarAttributes`,
        "GET",
        undefined,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCarAttributes(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [errorModal, setErrorModal] = React.useState(false);

  const [carDetails, setCarDetails] = useState([]);

  const [carAttributes, setCarAttributes] = useState([]);

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );

  // User input errors
  const [modelError, setModelError] = React.useState(false);
  const [fuelTypeError, setFuelTypeError] = React.useState(false);
  const [transmissionTypeError, setTransmissionTypeError] =
    React.useState(false);
  const [averageRangeError, setAverageRangeError] = React.useState(false);
  const [carTypeError, setCarTypeError] = React.useState(false);
  const [numberOfSeatsError, setNumberOfSeatsError] = React.useState(false);
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const history = useHistory();

  const handleErrorModalClose = () => {
    setErrorModal(false);
    resetError();
  };

  // Account creation handler
  const handleUpdateCar = async () => {
    try {
      const res = await sendRequest(
        "http://localhost:5000/api/car/updateCar",
        "POST",
        JSON.stringify({
          carID: car._id,
          carModel: state.inputs.model.value
            ? state.inputs.model.value
            : car.carModel,
          fuelType: state.inputs.fuelType.value
            ? state.inputs.fuelType.value
            : car.fuelType,
          transmissionType: state.inputs.transmissionType.value
            ? state.inputs.transmissionType.value
            : car.transmissionType,
          averageRange: state.inputs.averageRange.value
            ? state.inputs.averageRange.value
            : car.averageRange,
          maxNumberPassengers: state.inputs.numberOfSeats.value
            ? state.inputs.numberOfSeats.value
            : car.maxNumberPassengers,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchCar(car._id);
      props.onClose();
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Car update failed",
        status: error.message,
        type: "error",
      });
    }
  };

  const handleDeleteCar = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/car/deleteCar/${car._id}`,
        {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        }
      );

      const responseData = await response.json();
      setAlertModal({
        open: true,
        statusTitle: "Car was deleted",
        status: "Your car was deleted succesfully",
        type: "success",
      });

      history.push(`/profile/${car.owner}`);
    } catch (err) {
      console.log(err);
      setAlertModal({
        open: true,
        statusTitle: "Car deletion failed",
        status: err.message,
        type: "error",
      });
    }
  };

  const createOptions = (option) => {
    if (option) {
      if (option.includes("B")) {
        return (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        );
      }
    }
  };

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  const handleAlertModalClose = () => {
    if (alertModal.type === "success") {
    }
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  const handleDeletionWarning = (event) => {
    event.preventDefault();
    setAlertModal({
      open: true,
      statusTitle: "Warning",
      status: "Are you sure that you want to delete this car?",
      type: "warning",
    });
  };

  const onClose = () => {
    props.onClose();
  };

  return (
    <React.Fragment>
      <AlertModal
        open={alertModal.open}
        statusTitle={alertModal.statusTitle}
        status={alertModal.status}
        type={alertModal.type}
        onClick={handleAlertModalClose}
        handleDelete={handleDeleteCar}
      />
      <Dialog open={props.open} onClose={onClose}>
        <DialogActions>
          <IconButton
            onClick={onClose}
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
              Update your car
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.carModel}
                  fullWidth
                  variant="outlined"
                  id="model"
                  label="Model"
                  helperText={modelError && "Only letters and numbers allowed."}
                  error={modelError}
                  onChange={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setModelError,
                      "OnlyNumberOrLetterInput"
                    )
                  }
                ></TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.fuelType}
                  fullWidth
                  select
                  variant="outlined"
                  name="fuelType"
                  label="Fuel type"
                  helperText={fuelTypeError && "Please select the Fuel Type."}
                  error={fuelTypeError}
                  onChange={(event) =>
                    inputHandler(
                      event.target.name,
                      event.target.value,
                      setFuelTypeError
                    )
                  }
                >
                  {fromHashTableToArray(carAttributes.FUEL_TYPE).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.transmissionType}
                  fullWidth
                  select
                  variant="outlined"
                  name="transmissionType"
                  label="Transmission type"
                  helperText={
                    transmissionTypeError &&
                    "Please select the Transmission type."
                  }
                  error={transmissionTypeError}
                  onChange={(event) =>
                    inputHandler(
                      event.target.name,
                      event.target.value,
                      setTransmissionTypeError
                    )
                  }
                >
                  {fromHashTableToArray(carAttributes.TRANSMISSION_TYPE).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.averageRange}
                  select
                  fullWidth
                  id="averageRange"
                  name="averageRange"
                  label="Average range"
                  variant="outlined"
                  onChange={(event) =>
                    inputHandler(
                      event.target.name,
                      event.target.value,
                      setAverageRangeError
                    )
                  }
                  error={averageRangeError}
                  helperText={
                    averageRangeError && "Please select the average range."
                  }
                >
                  {fromHashTableToArray(carAttributes.AVERAGE_RANGES).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.carType}
                  fullWidth
                  select
                  variant="outlined"
                  name="carType"
                  label="Car type"
                  helperText={carTypeError && "Please select the car type."}
                  error={carTypeError}
                  onChange={(event) =>
                    inputHandler(
                      event.target.name,
                      event.target.value,
                      setCarTypeError
                    )
                  }
                >
                  {fromHashTableToArray(carAttributes.CAR_TYPE).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  defaultValue={car.maxNumberPassengers}
                  fullWidth
                  id="numberOfSeats"
                  label="Number of seats"
                  variant="outlined"
                  onChange={(event) =>
                    inputHandler(
                      event.target.id,
                      event.target.value,
                      setNumberOfSeatsError,
                      "OnlyNumberInput"
                    )
                  }
                  error={numberOfSeatsError}
                  helperText={
                    numberOfSeatsError && "Please enter only numbers."
                  }
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
                Delete Car
              </Button>

              <Button
                type="submit"
                variant="contained"
                onClick={handleUpdateCar}
                disabled={!state.isValid}
              >
                Update Car
              </Button>
            </Grid>
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};

export default CarUpdateForm;
