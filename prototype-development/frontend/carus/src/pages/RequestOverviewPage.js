import NavBar from "../components/Navigation/NavBar";
import FilterBar from "../components/FilterBar";
import CarCard from "../components/CarCard";
import { useState } from "react";
import { Card, Button, Grid, Container, Paper } from "@mui/material";
import * as React from "react";

import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import Footer from "../components/Navigation/Footer";

const RequestOverviewPage = () => {
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const auth = React.useContext(AuthContext);

  //Data which comes from the filterbar
  const [query, setQuery] = useState({
    carType: { value: "", isValid: true },
    carTypes: { value: [[]], isValid: true },
    startDateTime: { value: new Date(2018, 0), isValid: true },
    endDateTime: { value: new Date(2300, 0), isValid: true },
    name: { value: "", isValid: true },
    orderBy: { value: "ra", isValid: true },

    isValid: true,
  });
  //Fetching the carrequests everytime the query changes
  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchMyCarRequests();
    }
  }, [auth, query]);

  //All data needed on the cards
  const [data, setData] = React.useState([]);
  const [dataFiltered, setDataFiltered] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [carsPulled, setCarsPulled] = React.useState([]);
  const [userPictures, setUserPictures] = React.useState([]);
  const [previousRentals, setPreviousRentals] = React.useState([]);
  const [filter, setFilter] = React.useState("");

  //transforms a hashtable to an array to use the .map function
  const fromHashTableToArray = (list) => {
    var array = [];
    for (var i in list) {
      array.push(list[i]);
    }
    return array;
  };
  //Filters the requests by carType
  const filterCarType = (array) => {
    var carArray = [];
    var reqArray = [];
    for (var i = 0; i < array.length; i++) {
      if (carsPulled[i].carType === query.carType) {
        carArray.push(carsPulled[i]);
        reqArray.push(data[i]);
      }
    }
    setCarsPulled(carArray);
    return reqArray;
  };
  //Fetches the car requests, orders an filters them and downloads all data for the cards
  const fetchMyCarRequests = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/carRequest/getFilteredRequests`,
        "POST",
        JSON.stringify({
          page: "AsRequestor",
          startDateTime: query.startDateTime.value,
          endDateTime: query.endDateTime.value,
          receivingUser: query.name.value,
        }),

        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      console.log(res);
      const dummy = fromHashTableToArray(res);
      console.log(dummy);
      const ordered = orderCards(dummy, query.orderBy.value);
      console.log(1111, ordered);

      if (ordered) {
        var k = getAllCars(ordered);
        if (query.carType !== "") {
          var orderedAndFiltered = filterCarType(ordered);
        } else {
          orderedAndFiltered = ordered;
        }

        getAllPictures(orderedAndFiltered);
        getAllUsers(orderedAndFiltered);
        setData(orderedAndFiltered);
      }

      if (filter === "") {
        setDataFiltered(ordered);
      }
      return res;
    } catch (error) {
      console.log(error.message);
    }
  };
  //Gets all users which are requesters in the requests
  const getAllUsers = async (ordered) => {
    const usersZ = [];
    for (var i = 0; i < ordered.length; i++) {
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
        console.log(error.message);
      }
    }
    console.log(25, data);
    console.log(36, usersZ);
    setUsers(usersZ);
  };
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
        console.log(error.message);
      }
    }
    console.log(725, data);
    console.log(736, carsZ);
    setCarsPulled(carsZ);
  };
  //Gets all user pictures for the requesters of the request
  const getAllPictures = async (ordered) => {
    const usersZ = [];
    for (var i = 0; i < ordered.length; i++) {
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
            usersZ.push({ src: URL.createObjectURL(blob) });
          });
      } catch (error) {
        console.log(error.message);
      }
    }
    console.log(425, data);
    console.log(436, usersZ);
    setUserPictures(usersZ);
  };

  //Fetches previous rentals, filtering and ordering them
  const fetchPreviousRentals = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/rental/getPreviousRentals`,
        "POST",
        JSON.stringify({
          carType: query.carType.value,
          startDateTime: query.startDateTime.value,
          endDateTime: query.endDateTime.value,
          requestingUser: query.name.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      console.log(res);
      const dummy = fromHashTableToArray(res);
      const ordered = orderCards(dummy, query.orderBy.value);

      getAllCars(ordered);
      getAllPictures(ordered);
      getAllUsers(ordered);
      setPreviousRentals(ordered);
      return res;
    } catch (error) {
      console.log(error.message);
    }
  };
  //Orders the cards
  const orderCards = (dummy, order) => {
    var sorted;
    switch (order) {
      case "ra":
        sorted = dummy[0].sort((a, b) =>
          a.pricePerHour > b.pricePerHour
            ? 1
            : b.pricePerHour > a.pricePerHour
            ? -1
            : 0
        );
        break;
      case "rd":
        sorted = dummy[0].sort((a, b) =>
          a.pricePerHour > b.pricePerHour
            ? -1
            : b.pricePerHour > a.pricePerHour
            ? 1
            : 0
        );
        break;
      case "sa":
        sorted = dummy[0].sort(
          (a, b) =>
            new Date(a.requestStartDateTime) - new Date(b.requestStartDateTime)
        );
        break;
      case "sd":
        sorted = dummy[0].sort(
          (a, b) =>
            new Date(b.requestStartDateTime) - new Date(a.requestStartDateTime)
        );
        break;
      default:
        break;
    }
    return sorted;
  };
  //Sets the filters as well as fetching the car requests again, if the data is overwritten by pressing the previous button
  const setFiltering = (filters) => {
    if (filter === "PREVIOUS") {
      fetchMyCarRequests();
    }

    setFilter(filters);
    if (filter !== "PREVIOUS") {
      setDataFiltered([]);
      if (data) {
        data.map((option) =>
          option.carRequestStatus === filters ? dataFiltered.push(option) : ""
        );
      }
    } else {
      setDataFiltered(previousRentals);
    }
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
            onClick={() => setFiltering("PENDING")}
            sx={{ width: 400 }}
          >
            Pending Requests
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => setFiltering("ACCEPTED")}
            sx={{ width: 400 }}
          >
            Accepted Requests
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => setFiltering("DECLINED")}
            sx={{ width: 400 }}
          >
            Declined Requests
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={() => {
              fetchPreviousRentals();
              setFilter("PREVIOUS");
            }}
            sx={{ width: 400 }}
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
        sx={{
          height: "55vh",
          overflow: "scroll",
          overflowY: "hidden",
          scrollbarWidth: "none",

          mt: 2,
        }}
      >
        {/* All the Cards */}
        {filter !== "PREVIOUS"
          ? dataFiltered.map((option, index) => {
              return (
                <CarCard
                  key={option._id}
                  type="requestOverviewAsRenter"
                  car={carsPulled[index] ? carsPulled[index].car : ""}
                  user={users[index] ? users[index].user : ""}
                  picture={userPictures[index] ? userPictures[index] : ""}
                  option={option}
                >
                  {" "}
                </CarCard>
              );
            })
          : ""}
      </Grid>
      {/*     </Grid> */}
    </div>
  );
};

export default RequestOverviewPage;
