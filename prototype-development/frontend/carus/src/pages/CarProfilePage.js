import * as React from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import NavBar from "../components/Navigation/NavBar";
import ReviewCard from "../components/ReviewCard";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { useHistory } from "react-router-dom";
import CarInfoCard from "../components/Car/CarInfoCard";
import CarTimeTable from "../components/Car/CarTimeTable";
import { CarContext } from "../context/car-context";
import CarBackground from "../components/Car/CarBackground";
import SharingOfferDialog from "../components/SharingOfferCreationDialog";
import Footer from "../components/Navigation/Footer";

const CarProfilePage = () => {
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const auth = React.useContext(AuthContext);
  const [userCanEditPage, setUserCanEditPage] = React.useState(false);
  const carId = useParams()._id;
  const [car, setCar] = React.useState("");
  const [carOwner, setCarOwner] = React.useState("");
  const [carOwnerProfilePicture, setCarOwnerProfilePicture] =
    React.useState("");
  const [carTitlePicture, setCarTitlePicture] = React.useState("");
  const [carPicture, setCarPicture] = React.useState("");
  const [carPictureIndex, setCarPictureIndex] = React.useState(1);
  const [currentReviewIndex, setCurrentReviewIndex] = React.useState(0);
  const [currentReviewPicture, setCurrentReviewPicture] = React.useState({});
  const [carReviews, setCarReviews] = React.useState([]);

  const [sharingDialog, setSharingDialog] = React.useState(false);
  const [carOffers, setCarOffers] = React.useState();

  const history = useHistory();

  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchCar(carId);
      setUserCanEditPage(carOwner._id == auth.userId);
      setCarPictureIndex(0);
    }
  }, [auth]);

  React.useEffect(() => {
    setUserCanEditPage(carOwner._id == auth.userId);
  }, [carOwner]);

  React.useEffect(() => {
    let currentReviewer = carReviews[0];
    fetchReviewPicture(currentReviewer?.reviewingUser);
  }, [carReviews]);

  React.useEffect(() => {
    let currentReviewer = carReviews[currentReviewIndex];
    console.log(currentReviewer);
    fetchReviewPicture(currentReviewer?.reviewingUser);
  }, [currentReviewIndex]);

  React.useEffect(() => {
    fetchCarOwner(car.owner);
    fetchCarOffers(car);
    fetchCarTitlePicture(carId);
    fetchCarReviews();
  }, [car]);

  React.useEffect(() => {
    fetchCarPicture();
  }, [carPictureIndex]);

  const handleDialog = () => {
    setSharingDialog(!sharingDialog);
    fetchCarOffers(car);
  };

  //ugly way to handle next, should be refactored into the cards but time constrains
  const goNextCard = (direction, cardType) => {
    direction === "right"
      ? goNextCardRight(cardType)
      : goNextCardLeft(cardType);
  };

  const goNextCardRight = (cardType) => {
    if (cardType === "carPicture") {
      carPictureIndex === car.carPictures.length - 1
        ? setCarPictureIndex(0)
        : setCarPictureIndex(carPictureIndex + 1);
    } else {
      currentReviewIndex === carReviews.length - 1
        ? setCurrentReviewIndex(0)
        : setCurrentReviewIndex(currentReviewIndex + 1);
    }
  };

  const goNextCardLeft = (cardType) => {
    if (cardType === "carPicture") {
      carPictureIndex === 0
        ? setCarPictureIndex(car.carPictures.length - 1)
        : setCarPictureIndex(carPictureIndex - 1);
    } else {
      currentReviewIndex === 0
        ? setCurrentReviewIndex(carReviews.length - 1)
        : setCurrentReviewIndex(currentReviewIndex - 1);
    }
  };

  const fetchCar = async (carId) => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/car/getCar/${carId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCar(res.car);
    } catch (error) {
      console.log(error);
      history.push("/error");
    }
  };

  const fetchCarOwner = async (userId) => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/user/getUser/${userId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCarOwner(res.user);
      if (carOwner._id != carOwner.id) {
        setUserCanEditPage(false);
      }
      fetchCarOwnerProfilePicture(userId);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarOwnerProfilePicture = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/getProfilePicture/${userId}`,
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
          setCarOwnerProfilePicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarPicture = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/car/getCarPictures/${carId}/${carPictureIndex}`,
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
          setCarPicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarTitlePicture = async (carId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/car/getCarTitlePicture/${carId}`,
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
          setCarTitlePicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarOffers = async (car) => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/carOffer/getCarOffersByCar`,
        "POST",
        JSON.stringify({
          car: car,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setCarOffers(res.carOffers);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarReviews = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/review/getAllCarReviews/${carId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      ).then((res) => setCarReviews(res.reviews));
    } catch (error) {}
  };

  const fetchReviewPicture = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/getProfilePicture/${userId}`,
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
          setCurrentReviewPicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <CarContext.Provider
        value={{
          userCanEditPage: userCanEditPage,
          car: car,
          fetchCar: fetchCar,
          carOwner: carOwner,
          carOwnerProfilePicture: carOwnerProfilePicture,
          carOffers: carOffers,
          carPicture: carPicture,
          fetchCarPicture: fetchCarPicture,
          carPictureIndex: carPictureIndex,
          goNextPicture: goNextCard,
          carTitlePicture: carTitlePicture,
          fetchCarTitlePicture: fetchCarTitlePicture,
        }}
      >
        <NavBar />
        <Grid container>
          <Grid item xs={6}>
            <CarInfoCard />
          </Grid>
          <Grid container xs={6} paddingTop="3%">
            <Grid item xs={12}>
              <Typography variant="h5">Car Reviews</Typography>
              {carReviews.length > 0 ? (
                <ReviewCard
                  review={carReviews[currentReviewIndex]}
                  picture={currentReviewPicture}
                  updateFunction={goNextCard}
                  multipleCards={carReviews.length > 1}
                ></ReviewCard>
              ) : (
                <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                  {userCanEditPage
                    ? "Your car has not been reviewed yet"
                    : `There are no reviews about this car`}
                </Typography>
              )}

              <Grid item xs={12} paddingTop="5%">
                <Grid container gap={3}>
                  <Grid container gap={2} alignItems="center">
                    <Typography variant="h5">Available Offers</Typography>
                    {userCanEditPage && (
                      <Button variant="contained" onClick={handleDialog}>
                        Create an Offer
                      </Button>
                    )}
                  </Grid>
                  <Grid item width="100%">
                    {car &&
                      (car.carOffers.length > 0 ? (
                        <CarTimeTable></CarTimeTable>
                      ) : (
                        <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                          {userCanEditPage
                            ? "Your car has no available offers"
                            : `There are no available offers for this car`}
                        </Typography>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <SharingOfferDialog open={sharingDialog} onClick={handleDialog} />
        <Footer />
      </CarContext.Provider>
    </>
  );
};

export default CarProfilePage;
