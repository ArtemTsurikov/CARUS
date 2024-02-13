import {
  Typography,
  Grid,
  Box,
  TextField,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  ListItemText,
  IconButton,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { AuthContext } from "../context/auth-context";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { useState } from "react";
import * as React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AlertModal from "./AlertModal";
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
    brand: { value: "", isValid: false },
    model: { value: "", isValid: false },
    fuelType: { value: "", isValid: false },
    transmissionType: { value: "", isValid: false },
    averageRange: { value: "", isValid: false },
    carType: { value: "", isValid: false },
    numberOfSeats: { value: 0, isValid: false },
    requiredDrivingLicense: { value: "", isValid: false },
  },
  isValid: false,
};
const CarAddingForm = (props) => {
  const auth = React.useContext(AuthContext);

  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAttributesCar();
      setBrandS(fromHashTableToArray(carAttributes.CAR_BRAND));
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

  const [formOpen, setFormOpen] = useState(false);

  const [carAttributes, setCarAttributes] = useState([]);

  const [brandsS, setBrandS] = useState(["BMW", "VW"]);

  const [state, inputHandler] = useForm(
    initialState.inputs,
    initialState.isValid
  );

  // User input errors
  const [brandError, setBrandError] = React.useState(false);
  const [modelError, setModelError] = React.useState(false);
  const [fuelTypeError, setFuelTypeError] = React.useState(false);
  const [transmissionTypeError, setTransmissionTypeError] =
    React.useState(false);
  const [averageRangeError, setAverageRangeError] = React.useState(false);
  const [carTypeError, setCarTypeError] = React.useState(false);
  const [numberOfSeatsError, setNumberOfSeatsError] = React.useState(false);
  const [requiredDrivingLicenseError, setRequiredDrivingLicenseError] =
    React.useState(false);
  const [carDetailsError, setCarDetailsError] = React.useState(false);

  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const history = useHistory();

  const handleErrorModalClose = () => {
    setErrorModal(false);
    resetError();
  };

  const handleChangeCarDetails = (event) => {
    const {
      target: { value },
    } = event;
    setCarDetails(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Account creation handler
  const handleCreateCar = async (event) => {
    event.preventDefault();
    /*         console.log("hier"); */
    try {
      const res = await sendRequest(
        "http://localhost:5000/api/car/addCar",
        "POST",
        JSON.stringify({
          carBrand: state.inputs.brand.value,
          carModel: state.inputs.model.value,
          averageRange: state.inputs.averageRange.value,
          carType: state.inputs.carType.value,
          fuelType: state.inputs.fuelType.value,
          transmissionType: state.inputs.transmissionType.value,
          carEquipement: carDetails,
          drivingLicense: state.inputs.requiredDrivingLicense.value,
          maxNumberPassengers: state.inputs.numberOfSeats.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      console.log(res);
      history.push(`/car/${res.carId}`);
    } catch (error) {
      setAlertModal({
        open: true,
        statusTitle: "Car creation failed",
        status: error.message,
        type: "error",
      });
    }
  };

  const createOptions = (option) => {
    if (option) {
      if (option.includes("B")) {
        return <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      }
    }
  }

  const handleAlertModalClose = () => {
    if (alertModal.type === "success") {
    }
    resetError();
    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
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
      <IconButton
        onClick={props.toDoOnCancel}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],

        }}
      >
        <CloseIcon />
      </IconButton>
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
            Add a new car
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                disablePortal
                id="brand"
                options={fromHashTableToArray(carAttributes.CAR_BRAND)}
                onInputChange={(event) => {
                  inputHandler(
                    "brand",
                    event.target.outerText ? event.target.outerText : "",
                    setBrandError
                  );
                  console.log(state);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Brand" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
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
                {fromHashTableToArray(carAttributes.FUEL_TYPE).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                required
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
                required
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
                {fromHashTableToArray(carAttributes.CAR_TYPE).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
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
                helperText={numberOfSeatsError && "Please enter only numbers."}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                variant="outlined"
                name="requiredDrivingLicense"
                label="Required driving license"
                helperText={
                  requiredDrivingLicenseError &&
                  "Please select the required driving license."
                }
                error={requiredDrivingLicenseError}
                onChange={(event) =>
                  inputHandler(
                    event.target.name,
                    event.target.value,
                    setRequiredDrivingLicenseError
                  )
                }
              >
                {fromHashTableToArray(carAttributes.DRIVINGLICENSE).map(

                  (option) => (

                    createOptions(option)

                  )
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="carDetails">Car Equipment</InputLabel>
                <Select
                  labelId="carDetails"
                  id="carDetailsSelect"
                  label="Car equipment"
                  multiple
                  value={carDetails}
                  helperText={
                    carDetailsError && "Please select the car details."
                  }
                  error={carDetailsError}
                  onChange={handleChangeCarDetails}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {fromHashTableToArray(carAttributes.CAR_EQUIPMENT).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        <Checkbox checked={carDetails.indexOf(option) > -1} />
                        <ListItemText primary={option} />
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
            </Grid>

          </Grid>
          <Button
            type="submit"
            variant="contained"
            onClick={handleCreateCar}
            disabled={!state.isValid}
            sx={{ mt: 5, mb: 2, width: "50%" }}
          >
            Add a Car
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

export default CarAddingForm;
