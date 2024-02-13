import {
  Typography,
  Grid,
  Box,
  TextField,
  Container,
  MenuItem,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import * as React from "react";
import dayjs from "dayjs";

const RentalRequestDetailsForm = (props) => {
  
  /* Possible Form Input Errors */
  const [insuranceError, setInsuranceError] = React.useState(false);
  const [rentStartDateTimeError, setRentStartDateTimeError] = React.useState(false);
  const [rentEndDateTimeError, setRentEndDateTimeError] = React.useState(false);
  const [additionalInformationError, setAdditionalInformationError] = React.useState(false);

  const insurancePackages = ["Basic", "Advanced"];

  return (
    <React.Fragment>
      <Container maxWidth="md">
        <Box
          sx={{
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="renterName"
                label="Name of Renter"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={
                  props.data.inputs.renterName.value !== ""
                    ? props.data.inputs.renterName.value
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                id="insurance"
                label="Insurance Package"
                variant="outlined"
                defaultValue={
                  props.data.inputs.insuranceName.value !== ""
                    ? props.data.inputs.insuranceName.value
                    : undefined
                }
                onChange={(event) => {
                  props.updateData(
                    "insuranceName",
                    event.target.value,
                    setInsuranceError
                  );
                  props.determineInsurance(event.target.value);
                }}
                error={insuranceError}
                helperText={
                  insuranceError && "Please choose an insurance package"
                }
              >
                {insurancePackages.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="sharerName"
                label="Name of Sharer"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={
                  props.data.inputs.sharerName.value !== ""
                    ? props.data.inputs.sharerName.value
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="car"
                label="Car Model"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={
                  props.data.inputs.carModel.value !== ""
                    ? props.data.inputs.carModel.value
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography>
                <strong>
                  Please adjust your rental date and time if needed:
                </strong>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disablePast
                    id="rentalStartDateTime"
                    label="Choose rental start time"
                    value={
                      props.data.inputs.rentalStartDateTime.value !== ""
                        ? dayjs(props.data.inputs.rentalStartDateTime.value)
                        : undefined
                    }
                    error={rentStartDateTimeError}
                    onChange={(newValue) => {
                      console.log(newValue.format('YYYY-MM-DDTHH:mm:ss.sss'))
                      props.updateData(
                        "rentalStartDateTime",
                        newValue.format('YYYY-MM-DDTHH:mm:ss.sss'),
                        setRentStartDateTimeError,
                        "StartDateTimeInput"
                      );
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disablePast
                    id="rentalEndDateTime"
                    label="Choose rental end time"
                    value={
                      props.data.inputs.rentalEndDateTime.value !== ""
                        ? dayjs(props.data.inputs.rentalEndDateTime.value)
                        : undefined
                    }
                    error={rentEndDateTimeError}
                    onChange={(newValue) => {
                      props.updateData(
                        "rentalEndDateTime",
                        newValue.format('YYYY-MM-DDTHH:mm:ss.sss'),
                        setRentEndDateTimeError,
                        "EndDateTimeInput"
                      );
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                required
                id="additionalInformation"
                label="Additional Information"
                multiline
                maxRows={4}
                variant="outlined"
                defaultValue={
                  props.data.inputs.additionalInformation.value !== ""
                    ? props.data.inputs.additionalInformation.value
                    : undefined
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
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default RentalRequestDetailsForm;
