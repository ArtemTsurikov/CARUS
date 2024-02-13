import * as React from "react";
import { Grid, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadForm from "./CarFileService";
import { CarContext } from "../../context/car-context";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";

const CarBackground = () => {
  const { car, userCanEditPage, carTitlePicture, fetchCarTitlePicture } =
    React.useContext(CarContext);
  const [uploadBackgroundPicture, setUploadBackgroundPicture] =
    React.useState(false);
  const auth = React.useContext(AuthContext);
  const { isLoading, requestError, sendRequest, resetError } = useHttpClient();

  const uploadBackground = () => {
    setUploadBackgroundPicture(!uploadBackgroundPicture);
    fetchCarTitlePicture(car._id);
  };

  const onClose = () => {
    uploadBackground();
  };

  const deleteTitlePicture = async (event) => {
    try {
      const response = await sendRequest(
        `http://localhost:5000/api/car/deleteCarTitlePicture/${car._id}`,
        "DELETE",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
    } catch (err) {
      console.log(err);
    }
    window.location.reload(false);
    fetchCarTitlePicture(car._id);
  };

  return (
    <Grid
      container
      sx={{
        height: "20vh",
        padding: "1rem",
        backgroundSize: "cover",
        backgroundImage: `url(${carTitlePicture?.src})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Grid container justifyContent="flex-end" alignItems="flex-start">
        <IconButton onClick={deleteTitlePicture}>
          {carTitlePicture && (
            <DeleteForeverIcon sx={{ color: "blue" }}></DeleteForeverIcon>
          )}
        </IconButton>
        <IconButton onClick={uploadBackground}>
          {userCanEditPage && <EditIcon></EditIcon>}
          <FileUploadForm
            open={uploadBackgroundPicture}
            toDoOnClose={onClose}
            multiple={true}
            type="carTitlePicture"
            carID={car._id}
          ></FileUploadForm>
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default CarBackground;
