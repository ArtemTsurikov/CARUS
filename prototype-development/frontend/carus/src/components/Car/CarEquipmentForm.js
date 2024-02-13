import {
  Typography,
  Grid,
  Box,
  Container,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Backdrop,
  ListItemText,
  Checkbox,
  Dialog,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { useState } from "react";
import * as React from "react";
import { CarContext } from "../../context/car-context";
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

const CarEquipmentForm = (props) => {
  const auth = React.useContext(AuthContext);
  const { car, fetchCar } = React.useContext(CarContext);

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchAttributesCar();
    }
  }, [auth]);

  React.useEffect(() => {
    if (car) {
      setCarDetails(car.carEquipement);
    }
  }, [car]);

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

  // User input errors
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const [carDetailsError, setCarDetailsError] = React.useState(false);

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
  const handleUpdateCar = async () => {
    try {
      console.log(car._id);
      console.log(car.averageRange);
      const res = await sendRequest(
        "http://localhost:5000/api/car/updateCar",
        "POST",
        JSON.stringify({ carID: car._id, carEquipement: carDetails }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      fetchCar(car._id);
      props.onClose();
    } catch (error) {}
  };

  const onClose = () => {
    props.onClose();
  };

  return (
    <React.Fragment>
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
              Change Car equipment
            </Typography>
            <Grid container spacing={3}>
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
              onClick={handleUpdateCar}
              sx={{ mt: 5, mb: 2, width: "50%" }}
            >
              Update Car Equipment
            </Button>
            {isLoading && (
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            )}
          </Box>
        </Container>
      </Dialog>
    </React.Fragment>
  );
};

export default CarEquipmentForm;
