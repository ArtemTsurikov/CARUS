import NavBar from "../components/Navigation/NavBar";
import FilterBar from "../components/FilterBar";
import CarCard from "../components/CarCard";
import { useState } from "react";
import * as React from "react";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { Grid, Button } from "@mui/material";
import SharingOfferDialog from "../components/SharingOfferCreationDialog";
import Footer from "../components/Navigation/Footer";

const OfferOverviewPage = () => {
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const auth = React.useContext(AuthContext);

  const [sharingDialog, setSharingDialog] = React.useState(false);
  const [cars, setCars] = React.useState([[]]);
  const [carPictures, setCarPictures] = React.useState([[]]);

  const handleDialog = () => {
    setSharingDialog(!sharingDialog);
    fetchMyCarOffers();
  };
  //Data which comes from the filterbar
  const [query, setQuery] = useState({
    car: { value: "", isValid: true },
    offerStartDateTime: { value: new Date(), isValid: true },
    offerEndDateTime: { value: new Date(2030, 0), isValid: true },
    orderBy: { value: "ra", isValid: true },
    cars: { value: [[]], isValid: true },
    isValid: true,
  });

  const [data, setData] = React.useState([]);

  //Fetching the offers everytime the query changes
  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchMyCarOffers();
      fetchCar();
    }
  }, [auth, query]);

  /*   React.useEffect(() => {
      if (auth.isLoggedIn) {
      }
    }, [data]); */

  //transforms a hashtable to an array to use the .map function
  const fromHashTableToArray = (list) => {
    var array = [];
    for (var i in list) {
      array.push(list[i]);
    }
    return array;
  };
  //Fetches the car requests, orders them
  const fetchMyCarOffers = async () => {

    try {
      var res;
      if (query.car.value === "") {
        res = await sendRequest(
          `http://localhost:5000/api/carOffer/getMyCarOffersByUser`,
          "POST",
          JSON.stringify({
            offerStartDateTime: query.offerStartDateTime.value,
            offerEndDateTime: query.offerEndDateTime.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } else {
        res = await sendRequest(
          `http://localhost:5000/api/carOffer/getMyCarOffersByUserAndCar`,
          "POST",
          JSON.stringify({
            car: query.car.value,
            offerStartDateTime: query.offerStartDateTime.value,
            offerEndDateTime: query.offerEndDateTime.value,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      }

      const dummy = fromHashTableToArray(res);
      const ordered = orderCards(dummy, query.orderBy.value);
      getAllCarPictures(ordered);
      setData(ordered);
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
            picturesZ.push({ src: URL.createObjectURL(blob) });
          });
      } catch (error) { }
    }

    setCarPictures(picturesZ);
  };

  //Fetches all the users cars
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
      setCars(fromHashTableToArray(res));
    } catch (error) {

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
            new Date(a.offerStartDateTime) - new Date(b.offerStartDateTime)
        );
        break;
      case "sd":
        sorted = dummy[0].sort(
          (a, b) =>
            new Date(b.offerStartDateTime) - new Date(a.offerStartDateTime)
        );
        break;
      default:
        break;
    }

    return sorted;
  };
  //Reads the time and date from a string
  const getDateTimeFromString = (datetime) => {
    const date = datetime.substring(0, 10);
    const time = datetime.substring(11, 16);
    return date + " " + time;
  };
  //Gets brand and model by using the cars array
  const getBrandAndModelForId = (id) => {
    for (var i in query.cars.value[0]) {
      if (query.cars.value[0][i]._id == id) {
        return (
          query.cars.value[0][i].carBrand +
          " " +
          query.cars.value[0][i].carModel
        );
      }
    }

    return "";
  };

  return (
    <React.Fragment>
      <NavBar />
      <SharingOfferDialog
        open={sharingDialog}
        onClick={handleDialog}
        cars={cars}
      />
      <FilterBar onQuery={setQuery} page={"offer"} />
      <Grid container direction="row" sx={{ t: 2 }}>
        <Grid
          container
          width="25%"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%" }}
          overflow="hidden"
        ></Grid>
        <Grid
          id="cards"
          container
          width="50%"
          justifyContent="center"
          alignItems="center"
          sx={{
            height: "55vh",
            overflow: "scroll",
            scrollbarWidth: "none",
            overflowX: "hidden",
            mt: 2,
          }}
        >
          {data
            ? data.map((option, index) => (
              <CarCard
                dataForOffer={option}
                key={option._id}
                type="offerOverview"
                car={getBrandAndModelForId(option.car)}
                start={getDateTimeFromString(option.offerStartDateTime)}
                end={getDateTimeFromString(option.offerEndDateTime)}
                cost={option.pricePerHour + "€/h"}
                carPicture={carPictures[index] ? carPictures[index] : ""}

              >
                {" "}
              </CarCard>
            ))
            : ""}
        </Grid>

        <Grid
          container
          width="25%"
          alignContent="flex-end"
          justifyContent="center"
        >
          <Grid xs={8}></Grid>
          <Button
            variant="contained"
            xs={4}
            onClick={handleDialog}
            sx={{ mr: 1.5 }}
          >
            Create an Offer
          </Button>
        </Grid>
      </Grid>
      <Footer />
    </React.Fragment>
  );
};

export default OfferOverviewPage;
