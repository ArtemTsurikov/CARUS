import NavBar from "../components/Navigation/NavBar";
import FilterBar from "../components/FilterBar";
import { useState } from "react";
import * as React from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { Grid, Button } from "@mui/material";
import CarCard from "../components/CarCard";
import Map from "../components/Map/Map";
import Footer from "../components/Navigation/Footer";

const OfferOverviewPage = () => {
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const auth = React.useContext(AuthContext);

  const [sharingDialog, setSharingDialog] = React.useState(false);

  const [coords, setCoords] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [query, setQuery] = useState({
    carType: { value: "", isValid: true },
    carTypes: { value: [[]], isValid: true },
    searchRange: { value: 0, isValid: true },
    offerStartDateTime: { value: new Date(), isValid: true },
    offerEndDateTime: { value: new Date(2030, 0), isValid: true },
    priceLow: { value: 0, isValid: true },
    priceHigh: { value: 0, isValid: true },
    orderBy: { value: "ra", isValid: true },
    carModel: { value: "", isValid: true },
    isValid: true,
  });

  const [data, setData] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [userPictures, setUserPictures] = React.useState([]);
  const [cars, setCars] = React.useState([]);
  const [carPictures, setCarPictures] = React.useState([]);

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchMyCarOffersSearch();
    }
  }, [auth, query]);

  const getAllUsers = async (data) => {
    const usersZ = [];
    for (var i = 0; i < data.length; i++) {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/user/getUser/${data[i].user}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        usersZ.push(res);
      } catch (error) { }
    }

    setUsers(usersZ);

    insertPlaces(data, usersZ);
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
            picturesZ.push({ src: URL.createObjectURL(blob) });
          });
      } catch (error) { }
    }

    setCarPictures(picturesZ);
  };

  const getAllCars = async (data) => {
    const carsZ = [];
    for (var i = 0; i < data.length; i++) {
      try {
        const res = await sendRequest(
          `http://localhost:5000/api/car/getCar/${data[i].car}`,
          "GET",
          null,
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        carsZ.push(res);
      } catch (error) { }
    }

    setCars(carsZ);
  };

  const getAllPictures = async (data) => {
    const usersZ = [];
    for (var i = 0; i < data.length; i++) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/getProfilePicture/${data[i].user}`,
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
      } catch (error) { }
    }

    setUserPictures(usersZ);
  };

  const fromHashTableToArray = (list) => {
    var array = [];
    for (var i in list) {
      array.push(list[i]);
    }
    return array;
  };
  const fetchMyCarOffersSearch = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/carOffer/getMyCarOffersSearch`,
        "POST",
        JSON.stringify({
          startDateTime: query.offerStartDateTime.value,
          endDateTime: query.offerEndDateTime.value,
          priceLow: query.priceLow.value,
          priceHigh: query.priceHigh.value,
          carType: query.carType.value,
          carModel: query.carModel.value,
          lat: coords.lat,
          lng: coords.lng,
          distance: query.searchRange.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      const dummy = fromHashTableToArray(res);
      const ordered = orderCards(dummy[0], query.orderBy.value);

      getAllCars(ordered);
      getAllPictures(ordered);
      getAllUsers(ordered);
      getAllCarPictures(ordered);
      setData(ordered);
      return res;
    } catch (error) { }
  };

  function random() {
    //return a random number between -0.0005 and 0.0005
    const random = (Math.random() - 0.5) / 1000;
    return random;
  }

  //add random number to the coordinates to hidde the exact location of the user
  //only add users to map once
  const insertPlaces = (cards, users) => {
    var aPlace = [];
    var userIDs = [];
    console.log(11, cards);
    console.log(12, users);
    cards.map((option, index) => {
      if (!userIDs.includes(users[index].user._id)) {
        var place = { latitude: "", longitude: "", user: "" };
        place.latitude = users[index].user.address.latitude + random();
        place.longitude = users[index].user.address.longitude + random();
        place.user = users[index].user._id;
        userIDs.push(users[index].user._id);
        aPlace.push(place);
      }
    });
    setFilteredPlaces(aPlace);
  };

  const orderCards = (dummy, order) => {
    var sorted;
    switch (order) {
      case "ra":
        sorted = dummy.sort((a, b) =>
          a.pricePerHour > b.pricePerHour
            ? 1
            : b.pricePerHour > a.pricePerHour
              ? -1
              : 0
        );
        break;
      case "rd":
        sorted = dummy.sort((a, b) =>
          a.pricePerHour > b.pricePerHour
            ? -1
            : b.pricePerHour > a.pricePerHour
              ? 1
              : 0
        );
        break;
      case "sa":
        sorted = dummy.sort(
          (a, b) =>
            new Date(a.offerStartDateTime) - new Date(b.offerStartDateTime)
        );
        break;
      case "sd":
        sorted = dummy.sort(
          (a, b) =>
            new Date(b.offerStartDateTime) - new Date(a.offerStartDateTime)
        );
        break;
      case "da":
        sorted = dummy.sort((a, b) =>
          a.__v > b.__v ? -1 : b.__v > a.__v ? 1 : 0
        );

      default:
        break;
    }

    return sorted;
  };


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
    <React.Fragment>
      <NavBar />
      <FilterBar onQuery={setQuery} page={"search"} />
      <Grid container direction="row" sx={{ t: 2 }}>
        <Grid
          id="cards"
          container
          width="50%"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "60vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            overflowX: "hidden",
            mt: 2,
          }}
        >
          {data.map((option, index) => { return (<CarCard key={option._id} type='search' carPicture={carPictures[index] ? carPictures[index] : ""} start={getDateFormatOfDay(option.offerStartDateTime)} end={getDateFormatOfDay(option.offerEndDateTime)} distance={option.__v.toFixed(1)} car={cars[index] ? cars[index].car : ""} rating={users[index] ? (users[index].user.rating).toFixed(1) : ""} picture={userPictures[index] ? userPictures[index] : ""} cost={option.pricePerHour} > </CarCard>) })}

        </Grid>
        <Grid
          container
          width="50%"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
          overflow="hidden"
          sx={{ px: "2rem" }}
        >
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
          />
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  );
};

export default OfferOverviewPage;
