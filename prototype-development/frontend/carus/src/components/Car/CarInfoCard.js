import * as React from "react";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Button,
  Link,
  Card,
  CardMedia,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AuthContext } from "../../context/auth-context";
import { CarContext } from "../../context/car-context";
import FileUploadForm from "./CarFileService";
import CarUpdateForm from "./CarUpdateForm";
import CarEquipmentForm from "./CarEquipmentForm";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EquipmentList from "./CarEquipment";
import AlertModal from "../../components/AlertModal";
import { useHttpClient } from "../../hooks/http-hook";
import defaultImage from "../../icons/default.png";

const CarInfoCard = () => {
  const auth = React.useContext(AuthContext);
  const {
    car,
    carOwner,
    userCanEditPage,
    carOwnerProfilePicture,
    carPicture,
    carPictureIndex,
    goNextPicture,
    fetchCar,
    fetchCarPicture,
  } = React.useContext(CarContext);
  const [carInformationEditable, setCarInformationEditable] =
    React.useState(false);
  const [aboutCarText, setAboutCarText] = React.useState();
  const [uploadCarDocuments, setUploadCarDocuments] = React.useState(false);
  const [changeCarDetails, setChangeCarDetails] = React.useState(false);
  const [changeCarEquipment, setChangeCarEquipment] = React.useState(false);
  const [uploadCarPictures, setUploadCarPictures] = React.useState(false);
  const [deleteCarPicture, setDeleteCarPicture] = React.useState(false);
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();
  const [alertModal, setAlertModal] = React.useState({
    open: false,
    statusTitle: null,
    status: null,
    type: null,
  });

  const uploadPictures = () => {
    setUploadCarPictures(!uploadCarPictures);
  };

  const deleteCurrentPicture = () => {
    setDeleteCarPicture(!deleteCarPicture);
  };

  const onClose = () => {
    uploadPictures();
    fetchCar(car._id);
    fetchCarPicture();
  };

  const handleDeletePicture = async (event) => {
    try {
      if (carPictureIndex == 0) {
        //deletion of Last Picture -> need to empty the current profile picture
        window.location.reload(false);
      } else {
        //load previous picture
        goNextPicture("left");
      }

      const response = await sendRequest(
        `http://localhost:5000/api/car/deleteCarPicture/${car._id}/${carPictureIndex}`,
        "DELETE",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setAlertModal({
        open: true,
        statusTitle: "Picture succesfully deleted",
        status: "Your car picture was deleted succesfully",
        type: "success",
      });
      fetchCar(car._id);
    } catch (err) {
      setAlertModal({
        open: true,
        statusTitle: "Profile update failed",
        status: err.message,
        type: "error",
      });
    }
  };

  React.useEffect(() => {
    setAboutCarText(car.description);
  }, [car]);

  const editCarInformation = () => {
    setCarInformationEditable(!carInformationEditable);
  };

  const cancelEditPersonalSection = () => {
    setAboutCarText(car.description);
    editCarInformation();
  };

  const handleDeletionWarning = (event) => {
    event.preventDefault();
    setAlertModal({
      open: true,
      statusTitle: "Warning",
      status: "Are you sure that you want to delete this picture?",
      type: "warning",
    });
  };

  const onSavePersonalSection = async () => {
    editCarInformation();
    try {
      const response = await fetch(`http://localhost:5000/api/car/updateCar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify({
          carID: car._id,
          description: aboutCarText,
        }),
      });

      const responseData = await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const editCarDocuments = () => {
    setUploadCarDocuments(!uploadCarDocuments);
    fetchCar(car._id);
  };

  const editCarDetails = () => {
    setChangeCarDetails(!changeCarDetails);
  };

  const editCarEquipment = () => {
    setChangeCarEquipment(!changeCarEquipment);
  };

  const handleAlertModalClose = () => {
    if (alertModal.type === "success") {
      deleteCurrentPicture();
    }

    setAlertModal({ open: false, statusTitle: null, status: null, type: null });
  };

  return (
    <>
      <AlertModal
        open={alertModal.open}
        statusTitle={alertModal.statusTitle}
        status={alertModal.status}
        type={alertModal.type}
        onClick={handleAlertModalClose}
        handleDelete={handleDeletePicture}
      />
      <Grid container direction="column" padding="7rem" paddingTop="5%" gap={3}>
        <Grid container textAlign="start">
          <Box width="100%">
            <Grid container xs={6} alignItems="center" width="100%">
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {car?.carBrand} {car?.carModel}
              </Typography>
            </Grid>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
            ></Typography>
          </Box>
          <Box flex={1}>
            <Card>
              <CardMedia
                image={
                  car.carPictures?.length > 0 ? carPicture.src : defaultImage
                }
                sx={{ height: 300 }}
              >
                {" "}
                <Grid container height={300} alignContent="center">
                  <Grid item>
                    {car.carPictures?.length > 1 && (
                      <IconButton
                        onClick={(e) => {
                          goNextPicture("left", "carPicture");
                        }}
                      >
                        <NavigateNextIcon
                          sx={{ transform: "rotate(180deg)", color: "blue" }}
                        ></NavigateNextIcon>
                      </IconButton>
                    )}
                  </Grid>
                  <Grid item marginLeft="auto">
                    {car.carPictures?.length > 1 && (
                      <IconButton
                        onClick={(e) => {
                          goNextPicture("right", "carPicture");
                        }}
                      >
                        <NavigateNextIcon
                          sx={{ color: "blue" }}
                        ></NavigateNextIcon>
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </CardMedia>
              <Grid container height="100%">
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    {userCanEditPage && (
                      <>
                        {car.carPictures?.length > 0 && (
                          <IconButton onClick={handleDeletionWarning}>
                            <DeleteForeverIcon
                              sx={{ color: "blue" }}
                            ></DeleteForeverIcon>
                          </IconButton>
                        )}

                        <IconButton onClick={uploadPictures}>
                          <FileUploadIcon
                            sx={{ color: "blue" }}
                          ></FileUploadIcon>
                        </IconButton>
                      </>
                    )}
                    {!userCanEditPage && (
                      <>
                        <Button href={carPicture?.src}>
                          {" "}
                          View in Full Screen
                        </Button>
                      </>
                    )}
                    <FileUploadForm
                      open={uploadCarPictures}
                      toDoOnClose={onClose}
                      multiple={true}
                      type="carPictures"
                      carID={car._id}
                    ></FileUploadForm>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
            <Grid container alignItems="center">
              <Typography variant="h4">Rating: {car?.rating}</Typography>
              <StarIcon sx={{ size: "large" }}></StarIcon>
            </Grid>
          </Box>
        </Grid>
        <Grid item textAlign="start">
          <Box>
            <Grid container>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                About the car
                {!carInformationEditable && userCanEditPage && (
                  <IconButton onClick={editCarInformation}>
                    <EditIcon></EditIcon>
                  </IconButton>
                )}
              </Typography>
            </Grid>
            {carInformationEditable && (
              <Box>
                <TextField
                  variant="standard"
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  value={aboutCarText}
                  multiline
                  disabled={!true}
                  onChange={(e) => setAboutCarText(e.target.value)}
                ></TextField>
                <Button onClick={cancelEditPersonalSection}>Cancel</Button>
                <Button onClick={onSavePersonalSection}>Save</Button>
              </Box>
            )}
            {!carInformationEditable && (
              <Box>
                <Typography>{aboutCarText}</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid container alignItems="flex-start">
          <Grid container xs={6}>
            <Grid container alignItems="center" flexWrap="nowrap">
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Car information
              </Typography>
              {userCanEditPage && (
                <>
                  <IconButton onClick={editCarDetails}>
                    <EditIcon></EditIcon>
                  </IconButton>

                  <CarUpdateForm
                    open={changeCarDetails}
                    onClose={editCarDetails}
                  ></CarUpdateForm>
                </>
              )}
            </Grid>
            <Grid item>
              <Typography>Car type: {car?.carType}</Typography>
              <Typography>Fuel type: {car?.fuelType}</Typography>
              <Typography>
                Transmission type: {car?.transmissionType}
              </Typography>
              <Typography>Average range: {car?.averageRange}</Typography>
              <Typography>Max. seats: {car?.maxNumberPassengers}</Typography>
            </Grid>
          </Grid>
          <Grid container xs={6}>
            <Grid container alignItems="center" flexWrap="nowrap">
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Car documents
              </Typography>
              {userCanEditPage && (
                <IconButton onClick={editCarDocuments}>
                  <FileUploadIcon></FileUploadIcon>
                </IconButton>
              )}
              <FileUploadForm
                open={uploadCarDocuments}
                toDoOnClose={editCarDocuments}
                multiple={true}
                type="carOwnership"
                carID={car._id}
                verified={car.carOwenrshipVerificationStatus}
              ></FileUploadForm>
            </Grid>

            {car.carOwenrshipVerificationStatus === "Verified" ? (
              <Grid container alignItems="center" flexWrap="nowrap">
                {userCanEditPage ? (
                  <>
                    <Typography>Your car documents are verified</Typography>
                    <VerifiedIcon></VerifiedIcon>
                  </>
                ) : (
                  <>
                    <Typography>Car documents are verified</Typography>
                    <VerifiedIcon></VerifiedIcon>
                  </>
                )}
              </Grid>
            ) : car.carOwenrshipVerificationStatus === "Pending" ? (
              <Grid container flexWrap="nowrap">
                {userCanEditPage ? (
                  <>
                    <Typography>
                      Your car documents are currently in review
                    </Typography>
                    <PendingIcon></PendingIcon>
                  </>
                ) : (
                  <>
                    <Typography>
                      Car documents are currently in review by an admin
                    </Typography>
                    <PendingIcon></PendingIcon>
                  </>
                )}
              </Grid>
            ) : (
              <Grid container flexWrap="nowrap">
                {userCanEditPage ? (
                  <>
                    <Typography>Your car documents are not valid</Typography>
                    <CancelIcon></CancelIcon>
                  </>
                ) : (
                  <>
                    <Typography>Car documents are not verified yet</Typography>
                    <CancelIcon></CancelIcon>
                  </>
                )}
              </Grid>
            )}
            <Grid item>
              <Grid item paddingTop="3%">
                <Typography variant="h5" fontWeight="bold">
                  Car owner
                </Typography>
              </Grid>
              <Grid container gap={2} alignItems="center">
                <Grid item>
                  <Avatar
                    src={carOwnerProfilePicture.src}
                    sx={{
                      width: { xs: "8vh" },
                      height: { xs: "8vh" },
                    }}
                  ></Avatar>
                </Grid>
                <Grid item>
                  <Link color="inherit" href={`/profile/${carOwner._id}`}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {carOwner.firstName} {carOwner.lastName}
                    </Typography>
                  </Link>
                  <Grid container flex={1}>
                    <Typography>
                      {`Number of Rentals ${car?.numberOfRentals}`}
                    </Typography>
                    <Grid container>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Rating: {carOwner.rating?.toString().slice(0, 3)}
                      </Typography>
                      <StarIcon></StarIcon>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item textAlign="start">
          <Grid container alignItems="center" flexWrap="nowrap">
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Car equipment
            </Typography>
            {userCanEditPage && (
              <IconButton onClick={editCarEquipment}>
                <EditIcon></EditIcon>
              </IconButton>
            )}
            <CarEquipmentForm
              open={changeCarEquipment}
              onClose={editCarEquipment}
            ></CarEquipmentForm>
          </Grid>
          <Grid item>
            {car &&
              (car.carEquipement.length > 0 ? (
                <EquipmentList equipment={car.carEquipement} />
              ) : (
                <Typography sx={{ color: "grey", fontStyle: "italic" }}>
                  This car does not have any additional equipment
                </Typography>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default CarInfoCard;
