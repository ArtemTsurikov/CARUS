import * as React from "react";
import { useParams } from "react-router-dom";
import { Button, Dialog, Grid, Typography } from "@mui/material";
import NavBar from "../components/Navigation/NavBar";
import ReviewCard from "../components/ReviewCard";
import CarCard from "../components/CarCard";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import ProfileBackground from "../components/Profile/ProfileBackground";
import CarAddingForm from "../components/CarAddingForm";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import { UserContext } from "../context/user-context";
import { useHistory } from "react-router-dom";
import Footer from "../components/Navigation/Footer";

const ProfilePage = () => {
  const { sendRequest } = useHttpClient();
  const auth = React.useContext(AuthContext);
  const userId = useParams()._id;
  const [user, setUser] = React.useState("");
  const [userCars, setUserCars] = React.useState([]);
  const [currentCarPicture, setCurrentCarPicture] = React.useState([]);
  const [currentCarIndex, setCurrentCarIndex] = React.useState(0);
  const [userReviews, setUserReviews] = React.useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = React.useState(0);
  const [currentReviewPicture, setCurrentReviewPicture] = React.useState({});
  const [userCanEditPage, setUserCanEditPage] = React.useState(false);
  const [profilePicture, setProfilPicture] = React.useState();
  const [titlePicture, setTitlePicture] = React.useState();
  const [addingCar, setAddingCar] = React.useState(false);

  const history = useHistory();

  //inital data fetch after the auth context is set
  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchUser(userId);
    }
  }, [auth]);
  //inital load of all data, which are user dependent
  React.useEffect(() => {
    if (auth.isLoggedIn) {
      fetchProfilePicture(userId);
      fetchTitlePicture(userId);
      fetchUserCars();
      fetchUserReview();
      setUserCanEditPage(auth.userId === userId);
    }
  }, [user]);

  //initial load of car pictures
  React.useEffect(() => {
    fetchCarPicture(userCars[0]);
    console.log(currentCarPicture);
  }, [userCars]);

  //initial load of reviews
  React.useEffect(() => {
    let currentReviewer = userReviews[0];
    fetchReviewPicture(currentReviewer?.reviewingUser);
  }, [userReviews]);

  //load new review if next icon is click
  React.useEffect(() => {
    let currentReviewer = userReviews[currentReviewIndex];
    fetchReviewPicture(currentReviewer?.reviewingUser);
  }, [currentReviewIndex]);

  //load new car if next icon is click
  React.useEffect(() => {
    fetchCarPicture(userCars[currentCarIndex]);
  }, [currentCarIndex]);

  const startAddCar = () => {
    setAddingCar(!addingCar);
  };

  //ugly way to handle next, should be refactored into the cards but time constrains
  const goNextCarCard = (direction, cardType) => {
    direction === "right"
      ? goNextCarCardRight(cardType)
      : goNextCarCardLeft(cardType);
  };

  const goNextCarCardRight = (cardType) => {
    cardType === "car"
      ? currentCarIndex === userCars.length - 1
        ? setCurrentCarIndex(0)
        : setCurrentCarIndex(currentCarIndex + 1)
      : currentReviewIndex === userReviews.length - 1
      ? setCurrentReviewIndex(0)
      : setCurrentReviewIndex(currentReviewIndex + 1);
  };

  const goNextCarCardLeft = (cardType) => {
    cardType === "car"
      ? currentCarIndex === 0
        ? setCurrentCarIndex(userCars.length - 1)
        : setCurrentCarIndex(currentCarIndex - 1)
      : currentReviewIndex === 0
      ? setCurrentReviewIndex(userReviews.length - 1)
      : setCurrentReviewIndex(currentReviewIndex - 1);
  };

  const fetchUser = async (userId = userId) => {
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
      setUser(res.user);
    } catch (error) {
      console.log(error.message);
      history.push("/error");
    }
  };

  const fetchProfilePicture = async (userId) => {
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
          setProfilPicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchTitlePicture = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/user/getTitlePicture/${userId}`,
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
          setTitlePicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
  };

  const fetchUserCars = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/car/getAllCarsByUserId/${userId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setUserCars(res.cars);
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchCarPicture = async (car) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/car/getCarPictures/${car._id}/0`,
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
          setCurrentCarPicture({ src: URL.createObjectURL(blob) });
        });
    } catch (error) {}
  };

  const fetchUserReview = async () => {
    try {
      const res = await sendRequest(
        `http://localhost:5000/api/review/getAllUserReviews/${userId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      ).then((res) => setUserReviews(res.reviews));
    } catch (error) {}
  };

  const fetchReviewPicture = async (userId) => {
    if (!userId) {
      return;
    }
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
    <div>
      <UserContext.Provider
        value={{
          user,
          userCanEditPage,
          profilePicture,
          titlePicture,
          fetchUser,
          fetchProfilePicture,
          fetchTitlePicture,
        }}
      >
        <NavBar />
        <ProfileBackground />
        <Grid container>
          <Grid
            container
            xs={6}
            padding="1rem"
            justifyContent="center"
            textAlign="center"
            gap={5}
          >
            <ProfileInfoCard />
          </Grid>
          <Grid
            container
            xs={6}
            paddingTop="1%"
            padding="1rem"
            paddingRight="5%"
          >
            <Grid container>
              <Grid item width="100%">
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold" }}
                  paddingBottom="1vh"
                >
                  Reviews
                </Typography>

                {userReviews.length > 0 ? (
                  <ReviewCard
                    review={userReviews[currentReviewIndex]}
                    picture={currentReviewPicture}
                    updateFunction={goNextCarCard}
                    multipleCards={userReviews.length > 1}
                  ></ReviewCard>
                ) : (
                  <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                    {userCanEditPage
                      ? "You have not been reviewed yet"
                      : "There are no reviews about this user"}
                  </Typography>
                )}
              </Grid>
              <Grid item width="100%">
                <Grid container>
                  <Grid container columnGap={2}>
                    <Grid item>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", pb: "2" }}
                      >
                        Cars
                      </Typography>
                    </Grid>
                    {userCanEditPage && (
                      <Grid item alignContent="center">
                        <Button
                          variant="contained"
                          onClick={() => {
                            startAddCar();
                          }}
                        >
                          Add Car
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  <Grid item width="100%" marginTop="2vh">
                    {userCars.length > 0 ? (
                      <CarCard
                        type="profileOverview"
                        car={userCars[currentCarIndex]}
                        carPicture={currentCarPicture}
                        updateFunction={goNextCarCard}
                        multipleCards={userCars.length > 1}
                        hasPicture={
                          userCars[currentCarIndex].carPictures?.length
                        }
                      ></CarCard>
                    ) : (
                      <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                        {userCanEditPage
                          ? "You do not have any cars yet"
                          : `
                        ${user.firstName} does not have any cars yet`}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Dialog open={addingCar} onClose={startAddCar}>
            <CarAddingForm toDoOnCancel={startAddCar}></CarAddingForm>
          </Dialog>
        </Grid>
        <Footer />
      </UserContext.Provider>
    </div>
  );
};

export default ProfilePage;
