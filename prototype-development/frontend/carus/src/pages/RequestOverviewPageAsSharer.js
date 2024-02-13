import NavBar from "../components/Navigation/NavBar";
import FilterBar from "../components/FilterBar";
import CarCard from "../components/CarCard";
import { useState } from "react";
import { Card, Button, Grid } from "@mui/material";
import * as React from "react";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";

const RequestOverviewPageAsSharer = () => {
    const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
    const auth = React.useContext(AuthContext);

    //Data which comes from the filterbar
    const [query, setQuery] = useState({
        car: { value: "", isValid: true },
        cars: { value: [[]], isValid: true },
        startDateTime: { value: "", isValid: true },
        endDateTime: { value: "", isValid: true },
        name: { value: "", isValid: true },
        orderBy: { value: "ra", isValid: true },

        isValid: true,
    });
    //Fetching the carrequests everytime the query changes
    React.useEffect(() => {
        if (auth.isLoggedIn) {
            fetchMyCarRequests(filter);
        }
    }, [auth, query]);

    //All data needed on the cards
    const [data, setData] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [carsPulled, setCarsPulled] = React.useState([]);
    const [userPictures, setUserPictures] = React.useState([]);
    const [carPictures, setCarPictures] = React.useState([]);
    const [filter, setFilter] = React.useState("Pending");

    //transforms a hashtable to an array to use the .map function
    const fromHashTableToArray = (list) => {
        var array = [];
        for (var i in list) {
            array.push(list[i]);
        }
        return array;
    };

    //Fetches the car requests, orders an filters them and downloads all data for the cards
    const fetchMyCarRequests = async (Status) => {
        try {
            const res = await sendRequest(
                `http://localhost:5000/api/carRequest/getCarRequestsFiltered`,
                "POST",
                JSON.stringify({
                    car: query.car.value,
                    page: "AsSharer",
                    startDateTime: query.startDateTime.value,
                    endDateTime: query.endDateTime.value,
                    requestingUser: query.name.value,
                    status: Status,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );


            const dummy = fromHashTableToArray(res);

            const ordered = orderCards(dummy, query.orderBy.value);


            //Gets all data
            getAllCars(ordered);
            getAllPictures(ordered, false);
            getAllUsers(ordered, false);
            getAllCarPictures(ordered);
            setData(ordered);

            return res;
        } catch (error) {

        }
    };

    //Gets all car pictures for the cars of the request
    const getAllCarPictures = async (ordered) => {
        const picturesZ = [];
        for (var i = 0; i < ordered.length; i++) {
            try {

                const res = await fetch(
                    `http://localhost:5000/api/car/getCarPictures/${ordered[i].car}/0`,
                    {
                        method: "GET",
                        body: null,
                        headers: {
                            Authorization: "Bearer " + auth.token,
                        },
                    }
                )
                    .then((res) => res.blob())
                    .then((blob) => {
                        picturesZ.push({ src: URL.createObjectURL(blob) })
                    });
            } catch (error) { }
        }
        setCarPictures(picturesZ);

    }


    //Gets all users which are requesters in the requests 
    const getAllUsers = async (ordered, rentFlag) => {
        const usersZ = [];
        for (var i = 0; i < ordered.length; i++) {
            if (rentFlag === false) {
                try {
                    const res = await sendRequest(
                        `http://localhost:5000/api/user/getUser/${ordered[i].requestingUser}`,
                        "GET",
                        null,
                        {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + auth.token,
                        }
                    );
                    usersZ.push(res);
                } catch (error) {
                }
            } else {
                try {
                    const res = await sendRequest(
                        `http://localhost:5000/api/user/getUser/${ordered[i].borrowingUser}`,
                        "GET",
                        null,
                        {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + auth.token,
                        }
                    );
                    usersZ.push(res);
                } catch (error) {

                }
            }

        }

        setUsers(usersZ);

    }
    //Gets all cars in the requests
    const getAllCars = async (ordered) => {
        const carsZ = [];
        for (var i = 0; i < ordered.length; i++) {
            try {
                const res = await sendRequest(
                    `http://localhost:5000/api/car/getCar/${ordered[i].car}`,
                    "GET",
                    null,
                    {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + auth.token,
                    }
                );
                carsZ.push(res);
            } catch (error) {

            }
        }

        setCarsPulled(carsZ);

    }
    const getAllPictures = async (ordered, rentFlag) => {
        const usersZ = [];
        for (var i = 0; i < ordered.length; i++) {
            if (rentFlag === false) {
                try {
                    const res = await fetch(
                        `http://localhost:5000/api/user/getProfilePicture/${ordered[i].requestingUser}`,
                        {
                            method: "GET",
                            body: null,
                            headers: {
                                Authorization: "Bearer " + auth.token,
                            },
                        }
                    )
                        .then((res) => res.blob())
                        .then((blob) => {
                            usersZ.push({ src: URL.createObjectURL(blob) })
                        });

                } catch (error) {

                }
            } else {
                try {
                    const res = await fetch(
                        `http://localhost:5000/api/user/getProfilePicture/${ordered[i].borrowingUser}`,
                        {
                            method: "GET",
                            body: null,
                            headers: {
                                Authorization: "Bearer " + auth.token,
                            },
                        }
                    )
                        .then((res) => res.blob())
                        .then((blob) => {
                            usersZ.push({ src: URL.createObjectURL(blob) })
                        });

                } catch (error) {

                }
            }

        }

        setUserPictures(usersZ);

    }
    //Fetches previous rentals, filtering and ordering them
    const fetchPreviousRentals = async () => {
        try {
            const res = await sendRequest(
                `http://localhost:5000/api/rental/getCarRentalsFiltered`,
                "POST",
                JSON.stringify({
                    car: query.car.value,
                    startDateTime: query.startDateTime.value,
                    endDateTime: query.endDateTime.value,
                    requestingUser: query.name.value,
                    page: "AsSharer",

                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );

            const dummy = fromHashTableToArray(res);
            const ordered = orderCards(dummy, query.orderBy.value);

            //Gets and Sets all needed information
            getAllCars(ordered);
            getAllPictures(ordered, true);
            getAllUsers(ordered, true);
            getAllCarPictures(ordered);
            setData(ordered)
            return res;

        } catch (error) {

        }
    };
    //Orders the cards
    const orderCards = (dummy, order) => {
        var sorted;
        switch (order) {
            case "ra":
                sorted = dummy[0].sort((a, b) =>
                    getEarningsNotFixed(a) > getEarningsNotFixed(b)
                        ? 1
                        : getEarningsNotFixed(b) > getEarningsNotFixed(a)
                            ? -1
                            : 0
                );
                break;
            case "rd":
                sorted = dummy[0].sort((a, b) =>
                    getEarningsNotFixed(a) > getEarningsNotFixed(b)
                        ? -1
                        : getEarningsNotFixed(b) > getEarningsNotFixed(a)
                            ? 1
                            : 0
                );
                break;
            case "sa":
                sorted = dummy[0].sort((a, b) => new Date(a.requestStartDateTime) - new Date(b.requestStartDateTime));
                break;
            case "sd":
                sorted = dummy[0].sort((a, b) => new Date(b.requestStartDateTime) - new Date(a.requestStartDateTime));
                break;
            default:
                break;
        }
        return sorted;
    }

    //Calculate Earnings
    const getEarningsNotFixed = (option) => {
        var hours =
            Math.abs(
                Date.parse(option.requestStartDateTime) -
                Date.parse(option.requestEndDateTime)
            ) /
            (60 * 60 * 1000);
        return hours * option.rentalFee;
    };
    //Calculate Earnings, fixed to 2
    const getEarnings = (option) => {
        var hours =
            Math.abs(
                Date.parse(option.requestStartDateTime) -
                Date.parse(option.requestEndDateTime)
            ) /
            (60 * 60 * 1000);
        return (hours * option.rentalFee).toFixed(2);
    };
    //Gets Date Formatted for Cards
    const getDateFormatOfDay = (dateString) => {
        const launchDate = new Date(dateString);
        const futureDate = new Date();
        futureDate.setTime(launchDate.getTime());

        const day = futureDate.toLocaleString("en-us", { weekday: "long" });
        const days = day.substring(0, 3);
        const date = dateString.slice(0, 10);
        const time = dateString.slice(11, 16);

        return `${days}, ${date}, ${time} `;
    };



    return (
        <div>
            <NavBar />
            <FilterBar onQuery={setQuery} page={"requestAsSharer"} />
            <Grid
                container
                spacing={8}
                flexDirection="row"
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilter("Pending");
                            fetchMyCarRequests("Pending");
                        }}
                        sx={{ width: 300 }}
                    >
                        Pending Requests
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilter("Accepted");
                            fetchMyCarRequests("Accepted");
                        }}
                        sx={{ width: 300 }}
                    >
                        Accepted Requests
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilter("Declined");
                            fetchMyCarRequests("Declined");
                        }}
                        sx={{ width: 300 }}
                    >
                        Declined Requests
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilter("Rentals");
                            fetchPreviousRentals();
                        }}
                        sx={{ width: 300 }}
                    >
                        Previous Rentals
                    </Button>
                </Grid>
            </Grid>

            <Grid
                id="cards"
                container
                justifyContent="center"
                alignItems="center"
                paddingX={"2vh"}
                flexDirection="column"
                gap={4}
                sx={{
                    height: "55vh",
                    overflow: "scroll",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                    overflowX: "hidden",

                    mt: 2,
                }}
            >
                {/* All the Cards */}

                {data ? data.map((option, index) => {
                    return (
                        <CarCard key={option._id}
                            filter={filter}
                            id={filter !== "Rental" ? option._id : option.carRequest}
                            carPicture={carPictures[index] ? carPictures[index] : ""}
                            rating={users[index] ? (users[index].user.rating).toFixed(1) : ""}
                            start={getDateFormatOfDay(option.requestStartDateTime)}
                            end={getDateFormatOfDay(option.requestEndDateTime)}
                            type='requestOverviewAsSharer'
                            earnings={getEarnings(option)}
                            car={carsPulled[index] ? carsPulled[index].car : ""}
                            user={users[index] ? users[index].user : ""}
                            picture={userPictures[index] ? userPictures[index] : ""}
                            option={option} > </CarCard>);
                }) : ""}


            </Grid>
        </div>
    );
};

export default RequestOverviewPageAsSharer;
