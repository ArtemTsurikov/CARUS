import {
  Typography,
  Grid,
  Box,
  TextField,
  Container,
  FormControlLabel,
  Checkbox,
  Button,
  stepClasses,
} from "@mui/material";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const RentalRequestFormSummary = (props) => {
  const [termsAcceptedError, setTermsAcceptedError] = React.useState(false);
  const [additionalInformationError, setAdditionalInformationError] = React.useState(false);

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2} alignItems={"center"}>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Name of Renter</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <TextField
                disabled
                required
                fullWidth
                id="renterName"
                variant="outlined"
                label="Name of Renter"
                value={
                  props.data.inputs.renterName.value !== ""
                    ? props.data.inputs.renterName.value
                    : ""
                }
              />
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Name of Sharer</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <TextField
                disabled
                required
                fullWidth
                id="sharerName"
                label="Name of Sharer"
                variant="outlined"
                value={
                  props.data.inputs.sharerName.value !== ""
                    ? props.data.inputs.sharerName.value
                    : ""
                }
              />
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Car Model</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <TextField
                disabled
                fullWidth
                id="carModel"
                label="Car Model"
                variant="outlined"
                value={
                  props.data.inputs.carModel.value !== ""
                    ? props.data.inputs.carModel.value
                    : ""
                }
              />
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Rental Start Time</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disabled
                    id="rentalStartDateTime"
                    label="Rental end time"
                    value={
                      props.data.inputs.rentalStartDateTime.value !== ""
                        ? dayjs(props.data.inputs.rentalStartDateTime.value.substring(0, props.data.inputs.rentalStartDateTime.value.length - 1))
                        : ""
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Rental End Time</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disabled
                    id="rentalEndDateTime"
                    label="Rental end time"
                    value={
                      props.data.inputs.rentalEndDateTime.value !== ""
                        ? dayjs(props.data.inputs.rentalEndDateTime.value.substring(0, props.data.inputs.rentalEndDateTime.value.length - 1))
                        : ""
                    }
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Insurance Package</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <TextField
                disabled
                required
                fullWidth
                id="insurance"
                label="Insurance Package"
                variant="outlined"
                value={
                  props.data.inputs.insuranceName.value !== ""
                    ? props.data.inputs.insuranceName.value
                    : ""
                }
              />
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">Additional Information</Typography>
              </Grid>
            )}
            <Grid item xs={12} sm={!props.dialogMode ? 8 : 12}>
              <TextField
                disabled = {props.requestEditable && props.editorMode ? false : true}
                fullWidth
                required
                id="additionalInformation"
                label="Additional Information"
                InputLabelProps={{ shrink: true }} 
                multiline
                maxRows={4}
                variant="outlined"
                defaultValue={
                  props.data.inputs.additionalInformation.value !== ""
                    ? props.data.inputs.additionalInformation.value
                    : ""
                }
                error={additionalInformationError}
                onChange={(event) =>
                  props.updateData(
                    event.target.id,
                    event.target.value,
                    setAdditionalInformationError
                  )
                }
              />
            </Grid>
            {!props.dialogMode && (
              <Grid item xs={12} sm={12}>
                <FormControlLabel
                  fullWidth
                  required
                  control={
                    <Checkbox
                      id="termsAccepted"
                      error={termsAcceptedError}
                      defaultValue={props.data.inputs.termsAccepted.value}
                      onChange={(event) =>
                        props.updateData(
                          event.target.id,
                          event.target.checked,
                          setTermsAcceptedError,
                          "CheckmarkInput"
                        )
                      }
                    />
                  }
                  label={
                    <>
                      <span>I hereby agree to the </span>
                      <Typography
                        component="a"
                        href="http://localhost:3000/termsOfService"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        terms and conditions
                      </Typography>
                    </>
                  }
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12}>
              <Typography variant="h5">
                {props.editorMode ? (
                  <strong>
                    {"Total Price: " +
                      props.data.inputs.totalPrice.value +
                      " €"}
                  </strong>
                ) : (
                  <strong>
                    {"Your earnings: " +
                      props.data.inputs.totalPrice.value +
                      " €"}
                  </strong>
                )}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default RentalRequestFormSummary;
