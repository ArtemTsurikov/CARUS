import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import NavLinks from "./Navigation/NavLinks";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CarCard from "./CarCard";
import dayjs from "dayjs";

import {
    Divider,
    Autocomplete,
    TextField,
    Grid,
    IconButton,
    Typography,
    MenuItem,
    Button,
    Paper,
} from "@mui/material";

const FilterBar = (props) => {

    //Used to get Day in one year
    var dateTodayOneYear = new Date();
    var date = dateTodayOneYear.setFullYear(dateTodayOneYear.getFullYear() + 1);


    //Switch case to get the correct FilterBar for each page.
    switch (props.page) {
        case "offer":
            var initialState = {
                inputs: {
                    car: { value: "", isValid: true },
                    offerStartDateTime: { value: new Date(), isValid: true },
                    offerEndDateTime: { value: dateTodayOneYear, isValid: true },
                    orderBy: { value: "ra", isValid: true },
                    cars: { value: [[]], isValid: true },
                },
                isValid: true,
            };
            break;
        case "search":
            var initialState = {
                inputs: {
                    carType: { value: "", isValid: true },
                    carTypes: { value: [[]], isValid: true },
                    searchRange: { value: 10000, isValid: true },
                    offerStartDateTime: { value: new Date(), isValid: true },
                    offerEndDateTime: { value: dateTodayOneYear, isValid: true },
                    priceLow: { value: 0, isValid: true },
                    priceHigh: { value: 120, isValid: true },
                    orderBy: { value: "ra", isValid: true },
                    carModel: { value: "", isValid: true },
                },
                isValid: true,
            };
            break;
        case "requestAsSharer":
            var initialState = {
                inputs: {
                    startDateTime: { value: new Date(), isValid: true },
                    endDateTime: { value: dateTodayOneYear, isValid: true },
                    name: { value: "", isValid: true },
                    orderBy: { value: "ra", isValid: true },

                    car: { value: "", isValid: true },
                    cars: { value: [[]], isValid: true },
                },
                isValid: true,
            };
            break;
        case "requestAsRequester":
            var initialState = {
                inputs: {
                    carType: { value: "", isValid: true },
                    carTypes: { value: [[]], isValid: true },
                    startDateTime: { value: new Date(), isValid: true },
                    endDateTime: { value: dateTodayOneYear, isValid: true },
                    name: { value: "", isValid: true },
                    orderBy: { value: "ra", isValid: true },
                },
                isValid: true,
            };
            break;
    }

    const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
    const auth = React.useContext(AuthContext);

    //Switch to fetch the cars or the cartypes dependening on the page
    React.useEffect(() => {
        if (auth.isLoggedIn) {
            switch (props.page) {
                case "offer":
                    fetchCar(JSON.parse(localStorage.getItem("userData")).userId);

                    break;
                case "search":
                    fetchCarTypes();

                    break;
                case "requestAsRequester":
                    fetchCarTypes();

                    break;
                case "requestAsSharer":
                    fetchCar(JSON.parse(localStorage.getItem("userData")).userId);
                    break;
            }
        }
    }, [auth]);


    //Used to sent data to the component above
    function handleInput() {
        props.onQuery(state.inputs);
    }

    const [state, inputHandler] = useForm(initialState.inputs);

    const fromHashTableToArray = (list) => {
        var array = [];
        for (var i in list) {
            array.push(list[i]);
        }
        return array;
    };
    //Fetches Cars for the User
    const fetchCar = async (userId) => {
        try {
            const res = await sendRequest(
                `http://localhost:5000/api/car/getCarsForUserID/` + userId,
                "GET",
                undefined,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );


            inputHandler("cars", fromHashTableToArray(res), setCarsError, "");

        } catch (error) {

        }
    };
    //Fetches Cars for the User
    const fetchCarTypes = async () => {
        try {
            const res = await sendRequest(
                `http://localhost:5000/api/car/getCarTypes`,
                "GET",
                undefined,
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );

            inputHandler("carTypes", res, setCarsError, "");
        } catch (error) {
            console.log(error.message);
        }
    };

    //Ability to use filters 
    const filter = () => {
        handleInput();
    };


    const [carError, setCarError] = React.useState(false);
    const [carsError, setCarsError] = React.useState(false);
    const [carModelError, setCarModelError] = React.useState(false);
    const [startDateTimeError, setStartDateTimeError] = React.useState(false);
    const [endDateTimeError, setEndDateTimeError] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [numberError, setNumberError] = React.useState(false);
    const [orderByError, setOrderByError] = React.useState(false);

    //Orderby options for different pages
    const orderByOptions = [
        { value: "Rental Cost per Hour, ascending", key: "ra" },
        { value: "Rental Cost per Hour, descending", key: "rd" },
        { value: "Start date, ascending", key: "sa" },
        { value: "Start date, descending", key: "sd" },
    ];

    const orderByOptionsSearch = [
        { value: "Distance, ascending", key: "da" },
        { value: "Rental Cost per Hour, ascending", key: "ra" },
        { value: "Rental Cost per Hour, descending", key: "rd" },
        { value: "Start date, ascending", key: "sa" },
        { value: "Start date, descending", key: "sd" },
    ];

    const orderByOptionsAsRequester = [
        { value: "Costs, ascending", key: "ra" },
        { value: "Costs, descending", key: "rd" },
        { value: "Start date, ascending", key: "sa" },
        { value: "Start date, descending", key: "sd" },
    ];

    const orderByOptionsAsSharer = [
        { value: "Earnings, ascending", key: "ra" },
        { value: "Earnings, descending", key: "rd" },
        { value: "Start date, ascending", key: "sa" },
        { value: "Start date, descending", key: "sd" },
    ];

    return (
        <Container maxWidth="100" sx={{ p: "2rem" }}>
            <Paper sx={{ borderColor: "text.primary" }}>
                {props.page == "offer" && (
                    <Grid container direction="row">
                        <Grid
                            container
                            width="25%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h5">Car</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="car"
                                        /*                   value={state.car} */
                                        label="Car"
                                        value={state.inputs.car.value}
                                        onChange={(event) =>
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setCarError,
                                                ""
                                            )
                                        }
                                        onInput={filter()}
                                    >
                                        {state.inputs.cars.value[0].length == 0 && (
                                            <MenuItem key={"No cars available"} value={"1"}>
                                                {"No cars available"}
                                            </MenuItem>
                                        )}
                                        {
                                            <MenuItem key={"any"} value={""}>
                                                {"Any"}
                                            </MenuItem>
                                        }
                                        {state.inputs.cars.value[0].map((option) => (
                                            <MenuItem key={option["_id"]} value={option["_id"]}>
                                                {option["carBrand"] + " " + option["carModel"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="50%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h5">Time window</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 1 }}
                                >
                                    <Grid item xs={12} sm={5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    id="offerStartDateTime"
                                                    label="Choose offer start time"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        },
                                                    }}
                                                    value={
                                                        state.inputs.offerStartDateTime.value !== ""
                                                            ? dayjs(state.inputs.offerStartDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "offerStartDateTime",
                                                            newValue,
                                                            setStartDateTimeError,
                                                            "StartDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Divider variant="middle" sx={{ borderStyle: "dashed" }} />
                                    </Grid>
                                    <Grid item xs={12} sm={5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    id="offerEndDateTime"
                                                    label="Choose offer end time"
                                                    value={
                                                        state.inputs.offerEndDateTime.value !== ""
                                                            ? dayjs(state.inputs.offerEndDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "offerEndDateTime",
                                                            newValue,
                                                            setEndDateTimeError,
                                                            "EndDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="25%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h5">Order by</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="orderBy"
                                        label="Order by"
                                        value={state.inputs.orderBy.value}
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setOrderByError,
                                                ""
                                            );
                                            filter();
                                        }}
                                    >
                                        {/*                   for(const [key, value] of orderByOptions){
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  } */}
                                        {orderByOptions.map((option) => (
                                            <MenuItem key={option["key"]} value={option["key"]}>
                                                {option["value"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {props.page == "search" && (
                    <Grid container direction="row">
                        <Grid
                            container
                            width="12.5%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Car Type</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="carType"
                                        /*                   value={state.car} */
                                        label="Car Type"
                                        value={state.inputs.carType.value}
                                        onChange={(event) =>
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setCarError,
                                                ""
                                            )
                                        }
                                        onInput={filter()}
                                    >
                                        {state.inputs.carTypes.value.length == 0 && (
                                            <MenuItem key={"No car types available"} value={"1"}>
                                                {"No car types available"}
                                            </MenuItem>
                                        )}
                                        {
                                            <MenuItem key={"any"} value={""}>
                                                {"Any"}
                                            </MenuItem>
                                        }
                                        {fromHashTableToArray(
                                            state.inputs.carTypes.value.CAR_TYPE
                                        ).map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="42%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Rental period</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 1 }}
                                >
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    fullWidth
                                                    id="offerStartDateTime"
                                                    label="Choose start time"
                                                    value={
                                                        state.inputs.offerStartDateTime.value !== ""
                                                            ? dayjs(state.inputs.offerStartDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "offerStartDateTime",
                                                            newValue,
                                                            setStartDateTimeError,
                                                            "StartDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Divider variant="middle" sx={{ borderStyle: "dashed" }} />
                                    </Grid>
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    id="offerEndDateTime"
                                                    label="Choose end time"
                                                    value={
                                                        state.inputs.offerEndDateTime.value !== ""
                                                            ? dayjs(state.inputs.offerEndDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "offerEndDateTime",
                                                            newValue,
                                                            setEndDateTimeError,
                                                            "EndDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Price per hour</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <Grid item xs={12} sm={5.5}>
                                        <TextField
                                            type="number"
                                            value={state.inputs ? state.inputs.priceLow.value : ""}
                                            fullWidth
                                            id="priceLow"
                                            label="Min. amount"
                                            variant="outlined"
                                            onChange={(event) =>
                                                inputHandler(
                                                    event.target.id,
                                                    event.target.value,
                                                    setNumberError,
                                                    "OnlyNumberInput"
                                                )
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Divider variant="middle" sx={{ borderStyle: "dashed" }} />
                                    </Grid>

                                    <Grid item xs={12} sm={5.5}>
                                        <TextField
                                            type="number"
                                            value={state.inputs ? state.inputs.priceHigh.value : ""}
                                            fullWidth
                                            id="priceHigh"
                                            label="Max. amount"
                                            variant="outlined"
                                            onChange={(event) =>
                                                inputHandler(
                                                    event.target.id,
                                                    event.target.value,
                                                    setNumberError,
                                                    "OnlyNumberInput"
                                                )
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="12.5%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Order by</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="orderBy"
                                        label="Order by"
                                        value={state.inputs.orderBy.value}
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setOrderByError,
                                                ""
                                            );
                                            filter();
                                        }}
                                    >
                                        {orderByOptionsSearch.map((option) => (
                                            <MenuItem key={option["key"]} value={option["key"]}>
                                                {option["value"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="12.5%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Car Model</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        name="carModel"
                                        label="Car model"
                                        value={state.inputs.carModel.value}
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setCarModelError,
                                                ""
                                            );
                                            filter();
                                        }}
                                    ></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {props.page == "requestAsRequester" && (
                    <Grid container direction="row">
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Car Type</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="carType"
                                        /*                   value={state.car} */
                                        label="Car Type"
                                        value={state.inputs.carType.value}
                                        onChange={(event) =>
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setCarError,
                                                ""
                                            )
                                        }
                                        onInput={filter()}
                                    >
                                        {state.inputs.carTypes.value.length == 0 && (
                                            <MenuItem key={"No car types available"} value={"1"}>
                                                {"No car types available"}
                                            </MenuItem>
                                        )}
                                        {
                                            <MenuItem key={"any"} value={""}>
                                                {"Any"}
                                            </MenuItem>
                                        }
                                        {fromHashTableToArray(
                                            state.inputs.carTypes.value.CAR_TYPE
                                        ).map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="40%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Time window</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 1 }}
                                >
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    fullWidth
                                                    id="startDateTime"
                                                    label="Choose start time"
                                                    value={
                                                        state.inputs.startDateTime.value !== ""
                                                            ? dayjs(state.inputs.startDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "startDateTime",
                                                            newValue,
                                                            setStartDateTimeError,
                                                            "StartDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Divider variant="middle" sx={{ borderStyle: "dashed" }} />
                                    </Grid>
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    id="endDateTime"
                                                    label="Choose end time"
                                                    value={
                                                        state.inputs.endDateTime.value !== ""
                                                            ? dayjs(state.inputs.endDateTime.value)
                                                            : undefined
                                                    }
                                                    error={endDateTimeError}
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "endDateTime",
                                                            newValue,
                                                            setEndDateTimeError,
                                                            "EndDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Lastname of sharer</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="name"
                                        label="Lastname of sharer"
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.id,
                                                event.target.value,
                                                setNameError,
                                                "OnlyNumberOrLetterInput"
                                            );
                                            filter();
                                        }}
                                    ></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Order by</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="orderBy"
                                        label="Order by"
                                        value={state.inputs.orderBy.value}
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setOrderByError,
                                                ""
                                            );
                                            filter();
                                        }}
                                    >
                                        {/*                   for(const [key, value] of orderByOptions){
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  } */}
                                        {orderByOptionsAsRequester.map((option) => (
                                            <MenuItem key={option["key"]} value={option["key"]}>
                                                {option["value"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {props.page == "requestAsSharer" && (
                    <Grid container direction="row">
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Cars</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="car"
                                        /*                   value={state.car} */
                                        label="Car"
                                        value={state.inputs.car.value}
                                        onChange={(event) =>
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setCarError,
                                                ""
                                            )
                                        }
                                        onInput={filter()}
                                    >
                                        {state.inputs.cars.value[0].length == 0 && (
                                            <MenuItem key={"No cars available"} value={"1"}>
                                                {"No cars available"}
                                            </MenuItem>
                                        )}
                                        {state.inputs.cars.value[0].map((option) => (
                                            <MenuItem key={option["_id"]} value={option["_id"]}>
                                                {option["carBrand"] + " " + option["carModel"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="40%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Time window</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 1 }}
                                >
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    fullWidth
                                                    id="startDateTime"
                                                    label="Choose start time"
                                                    value={
                                                        state.inputs.startDateTime.value !== ""
                                                            ? dayjs(state.inputs.startDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "startDateTime",
                                                            newValue,
                                                            setStartDateTimeError,
                                                            "StartDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Divider variant="middle" sx={{ borderStyle: "dashed" }} />
                                    </Grid>
                                    <Grid item xs={12} sm={5.5}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DemoContainer components={["DateTimePicker"]}>
                                                <DateTimePicker
                                                    id="endDateTime"
                                                    label="Choose end time"
                                                    value={
                                                        state.inputs.endDateTime.value !== ""
                                                            ? dayjs(state.inputs.endDateTime.value)
                                                            : undefined
                                                    }
                                                    onChange={(newValue) => {
                                                        inputHandler(
                                                            "endDateTime",
                                                            newValue,
                                                            setEndDateTimeError,
                                                            "EndDateTimeInput"
                                                        );
                                                        filter();
                                                    }}
                                                />
                                            </DemoContainer>
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Lastname of requester</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="row"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="name"
                                        value={state.inputs.name ? state.inputs.name.value : ""}
                                        label="Lastname of requester"
                                        /*                                         helperText={nameError && "Only letters and numbers allowed."}
                                                        error={nameError} */
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.id,
                                                event.target.value,
                                                setNameError,
                                                "True"
                                            );
                                            filter();
                                        }}
                                    ></TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            width="20%"
                            justifyContent="center"
                            alignItems="center"
                            style={{ height: "100%" }}
                        >
                            <Grid
                                container
                                justifyContent="center"
                                alignItems="center"
                                direction="column"
                                style={{ height: "100%" }}
                                sx={{ p: 2 }}
                            >
                                <Grid item>
                                    <Typography variant="h6">Order by</Typography>
                                </Grid>
                                <Grid
                                    container
                                    justifyContent="center"
                                    alignItems="center"
                                    direction="column"
                                    style={{ height: "100%" }}
                                    sx={{ p: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        select
                                        variant="outlined"
                                        name="orderBy"
                                        label="Order by"
                                        value={state.inputs.orderBy.value}
                                        onChange={(event) => {
                                            inputHandler(
                                                event.target.name,
                                                event.target.value,
                                                setOrderByError,
                                                ""
                                            );
                                            filter();
                                        }}
                                    >
                                        {/*                   for(const [key, value] of orderByOptions){
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  } */}
                                        {orderByOptionsAsSharer.map((option) => (
                                            <MenuItem key={option["key"]} value={option["key"]}>
                                                {option["value"]}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Paper>
        </Container>
    );
};
export default FilterBar;
