import * as React from "react";
import {
  Container,
  Box,
  Grid,
  Dialog,
  DialogActions,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { AuthContext } from "../../context/auth-context";
import CloseIcon from "@mui/icons-material/Close";

const FileUploadForm = (props) => {
  let state = {
    selectedFiles: undefined,
  };
  const auth = React.useContext(AuthContext);
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const [fileNames, setFileNames] = React.useState([]);
  const [files, setFiles] = React.useState();

  const selectFile = (event) => {
    setFiles(event.target.files);
    setFileUploaded(true);
    calculateFileNames(event);
  };

  const calculateFileNames = (event) => {
    let names = [];
    for (var i = 0; i < event.target.files.length; ++i) {
      names.push(<li key={i}>{event.target.files.item(i).name}</li>);
    }
    setFileNames(names);
  };

  const calculateEndpoint = (type, carID) => {
    console.log(props.carID);
    switch (type) {
      case "carPictures":
        return "car/uploadCarPictures";
      case "carOwnership":
        return `car/updateCarVerification`;
      case "carTitlePicture":
        return "car/uploadCarTitlePicture";
    }
  };

  const uploadFiles = async (carID) => {
    const formData = new FormData();
    formData.append("carID", props.carID);
    for (let i = 0; i < files.length; i++) {
      formData.append(props.type, files[i]);
    }

    const endpoint =
      "http://localhost:5000/api/" + calculateEndpoint(props.type);
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    });
    const responseData = await response.json();
    onClose();
  };

  const onClose = () => {
    props.toDoOnClose();
    setFileNames("");
    setFileUploaded(false);
  };

  return (
    <Dialog open={props.open} onClose={onClose}>
      <DialogActions>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon></CloseIcon>
        </IconButton>
      </DialogActions>
      <Box
        sx={{
          my: 4,
          mx: 4,
        }}
      >
        <Container maxWidth="md">
          <Grid
            container
            flex={1}
            padding="1rem"
            justifyContent="center"
            textAlign="center"
            gap={3}
          >
            <Grid item xs={12}>
              <Typography>
                Please upload your {props.multiple ? "files" : "file"} here
              </Typography>
              {props.type === "identityCardPicture" && (
                <Typography>
                  Please upload both sides of your identity card
                </Typography>
              )}
              {props.type === "licencePicture" && (
                <Typography>
                  Please upload both sides of your driving licence
                </Typography>
              )}
            </Grid>
            {props.verified === "Verified" && (
              <Grid item>
                <Typography fontWeight="bold">
                  You already uploaded a valid document. Please only upload
                  another one, if your licenses have changed
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <IconButton component="label">
                <input
                  multiple={props.multiple}
                  type="file"
                  hidden
                  onChange={(e) => {
                    selectFile(e);
                  }}
                />
                <FileUploadIcon></FileUploadIcon>
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              {!fileUploaded ? (
                <Typography>You did not provide a file yet</Typography>
              ) : (
                <Typography>{fileNames}</Typography>
              )}
            </Grid>

            <Grid item>
              <Button
                variant="contained"
                disabled={!fileUploaded}
                onClick={(e) => {
                  uploadFiles();
                }}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Dialog>
  );
};

export default FileUploadForm;
