import {
  Typography,
  Box,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";
import { AuthContext } from "../../context/auth-context";
import * as React from "react";

const RentalRequestSuccessFailure = (props) => {
  const auth = React.useContext(AuthContext);

  return (
    <React.Fragment>
      {props.success === true ? (
        <div>
          <Typography variant="h5" gutterBottom>
            Your Payement details have been accepted.
          </Typography>
          <Typography variant="subtitle1">
            Please proceed by submitting the request.
          </Typography>
        </div>
      ) : (
        <div>
          <Typography variant="h5" gutterBottom>
            Oooops, something went wrong...
          </Typography>
          <Typography variant="subtitle1">
            Please try to request the rental again.
          </Typography>
        </div>
      )}
    </React.Fragment>
  );
};

export default RentalRequestSuccessFailure;
