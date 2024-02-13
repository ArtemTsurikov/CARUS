import * as React from "react";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import background from "../icons/LP.jpg";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SharingOfferDialog from "../components/SharingOfferCreationDialog";
import RentalDetailsDialog from "../components/Rentals/RentalDetailsDialog";
import defaultImage from "../icons/default.png";

const CarCard = (props) => {
  const [sharingDialog, setSharingDialog] = React.useState(false);
  const [rentalRequestDialog, setRentalRequestDialog] = React.useState(false);

  const handleDialog = () => {
    setSharingDialog(!sharingDialog);
  };

  const handleRentalRequestDialog = () => {
    setRentalRequestDialog(!rentalRequestDialog);
  };


  //It is used like a switch case to have all CarCards in the same file
  return (
    <>
      {props.type === "profileOverview" && (
        <Card>
          <Grid container alignItems="center">
            <Grid item width="5%" justifySelf="center">
              {props.multipleCards && (
                <IconButton
                  onClick={(e) => {
                    props.updateFunction("left", "car");
                  }}
                >
                  <NavigateNextIcon
                    sx={{ transform: "rotate(180deg)", color: "grey" }}
                  ></NavigateNextIcon>
                </IconButton>
              )}
            </Grid>
            <Grid item width="90%">
              <CardActionArea href={`/car/${props.car._id}`}>
                <CardMedia
                  image={props.hasPicture ? props.carPicture.src : defaultImage}
                  sx={{ height: 200 }}
                ></CardMedia>
              </CardActionArea>
            </Grid>
            <Grid item width="5%">
              {props.multipleCards && (
                <IconButton
                  onClick={(e) => {
                    props.updateFunction("right", "car");
                  }}
                >
                  <NavigateNextIcon sx={{ color: "grey" }}></NavigateNextIcon>
                </IconButton>
              )}
            </Grid>
          </Grid>

          <CardContent>
            <Grid container justifyContent="center" justifyItems="center">
              <Grid item xs={4}>
                <Typography>{`${props.car.carBrand}, ${props.car.carModel} `}</Typography>
              </Grid>
              <Grid item xs={4} justifyContent="center" display="flex">
                <Typography>{`Rentals : ${props.car.numberOfRentals}`}</Typography>
              </Grid>
              <Grid container xs={4} justifyContent="flex-end ">
                <Typography>{`Rating ${props.car.rating
                  .toString()
                  .slice(0, 3)}`}</Typography>
                <StarIcon></StarIcon>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      {props.type === "offerOverview" && (
        <Card sx={{ minWidth: "90%", maxWidth: "90%", p: 2, m: 2 }}>
          <CardActionArea onClick={handleDialog}>
            <CardMedia
              sx={{ height: 200 }}
              image={props.carPicture ? props.carPicture.src : background}
            />

            <CardContent>
              <Grid container direction="row" spacing={2}>
                <Grid item width="50%">
                  <Typography>{props.car}</Typography>
                </Grid>
                <Grid item width="50%" direction="row" justifyContent="center">
                  <Typography>{props.cost}</Typography>
                </Grid>
                <Grid item width="50%" direction="row" justifyContent="center">
                  <Typography>Von: {props.start}</Typography>
                </Grid>
                <Grid item width="50%" direction="row" justifyContent="center">
                  <Typography>Bis: {props.end}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      )}

      {props.type === "search" && (
        <Card sx={{ minWidth: "90%", maxWidth: "90%", m: 2 }}>
          <CardActionArea href={`/car/${props.car._id}`}>
            <CardMedia
              sx={{ height: 200 }}
              image={props.carPicture ? props.carPicture.src : background}
            />
          </CardActionArea>

          <CardContent>
            <Grid container direction="row">
              <Grid container width="33%">
                <Grid
                  container
                  justifyContent="left"
                  alignItems="center"
                  direction="row"
                >
                  <Grid item>
                    <Typography>
                      {props.car.carBrand} {props.car.carModel} , Rentals:{" "}
                      {props.car.numberOfRentals}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                width="33%"
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>Distance from you: {props.distance} km</Typography>
              </Grid>
              <Grid
                container
                width="33%"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>Rental cost: {props.cost} €/h</Typography>
              </Grid>
              <Grid item width="33%">
                <Grid
                  container
                  justifyContent="left"
                  alignItems="center"
                  direction="row"
                  columnSpacing={"2vh"}
                >
                  <Grid item>
                    <Avatar
                      src={props.picture?.src}
                      sx={{
                        width: { xs: "4vh" },
                        height: { xs: "4vh" },
                      }}
                    ></Avatar>
                  </Grid>
                  <Grid item>
                    <StarIcon></StarIcon>
                  </Grid>
                  <Grid item>
                    <Typography>{props.rating}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                width="33%"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>Start: {props.start}</Typography>
              </Grid>
              <Grid
                container
                width="33%"
                justifyContent="center"
                alignItems="center"
              >
                <Typography>Ends: {props.end}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {props.type === "requestOverviewAsRequester" && (
        <Card>
          <RentalDetailsDialog
            open={rentalRequestDialog}
            close={handleRentalRequestDialog}
            carRequestId={props.filter !== "Rentals" ? props.option._id : props.option.carRequest}
          />
          <CardActionArea onClick={handleRentalRequestDialog}>
            <CardMedia
              sx={{ height: 140 }}
              image={props.carPicture ? props.carPicture.src : background}
            />

            <CardContent>
              <Grid container direction="row">
                <Grid container width="33%">
                  <Grid
                    container
                    justifyContent="left"
                    alignItems="center"
                    direction="row"
                    columnSpacing={"2vh"}
                  >
                    <Grid item>
                      <Avatar
                        src={props.picture?.src}
                        sx={{
                          width: { xs: "4vh" },
                          height: { xs: "4vh" },
                        }}
                      ></Avatar>
                    </Grid>
                    <Grid item>
                      <Typography>
                        {" "}
                        {props.user.firstName} {props.user.lastName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  width="33%"
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>
                    For: {props.car.carBrand} {props.car.carModel}
                  </Typography>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Total cost: {props.cost}€</Typography>
                </Grid>
                <Grid item width="33%">
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="row"
                    columnSpacing={"2vh"}
                  >
                    <Grid
                      container
                      width="20%"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <StarIcon></StarIcon>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography>{props.rating}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Starts: {props.start}</Typography>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Ends: {props.end}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
      {props.type === "requestOverviewAsSharer" && (
        <Card>
          <RentalDetailsDialog
            open={rentalRequestDialog}
            close={handleRentalRequestDialog}
            carRequestId={props.filter !== "Rentals" ? props.option._id : props.option.carRequest}
          />
          <CardActionArea onClick={handleRentalRequestDialog}>
            <CardMedia
              sx={{ height: 140 }}
              image={props.carPicture ? props.carPicture.src : background}
            />

            <CardContent>
              <Grid container direction="row">
                <Grid container width="33%">
                  <Grid
                    container
                    justifyContent="left"
                    alignItems="center"
                    direction="row"
                    columnSpacing={"2vh"}
                  >
                    <Grid item>
                      <Avatar
                        src={props.picture?.src}
                        sx={{
                          width: { xs: "4vh" },
                          height: { xs: "4vh" },
                        }}
                      ></Avatar>
                    </Grid>
                    <Grid item>
                      <Typography>
                        {" "}
                        {props.user.firstName} {props.user.lastName}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  width="33%"
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>
                    For: {props.car.carBrand} {props.car.carModel}
                  </Typography>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Earnings: {props.earnings}€</Typography>
                </Grid>
                <Grid item width="33%">
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    direction="row"
                    columnSpacing={"2vh"}
                  >
                    <Grid
                      container
                      width="20%"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item>
                        <StarIcon></StarIcon>
                      </Grid>
                    </Grid>

                    <Grid item>
                      <Typography>{props.rating}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Starts: {props.start}</Typography>
                </Grid>
                <Grid
                  container
                  width="33%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography>Ends: {props.end}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      )}
      <SharingOfferDialog
        open={sharingDialog}
        onClick={handleDialog}
        data={props.dataForOffer}
        carModel={props.car}
      />
    </>
  );
};

export default CarCard;
