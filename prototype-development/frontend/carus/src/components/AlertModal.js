import {
  Alert,
  Box,
  IconButton,
  AlertTitle,
  Modal,
  Button,
  DialogActions,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";

const ErrorModal = (props) => {
  return (
    <Modal open={props.open}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="87vh"
      >
        <Alert
          action={
            <IconButton color="inherit" size="small" onClick={props.onClick}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ width: "65%" }}
          severity={props.type}
        >
          <AlertTitle>
            <strong>{props.statusTitle}</strong>
          </AlertTitle>
          {props.status}
          {props.type === "warning" && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={props.handleDelete}
                >
                  YES
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="inherit"
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={props.onClick}
                >
                  NO
                </Button>
              </Grid>
            </Grid>
          )}
          {props.type === "info" && props.onConfirmCheckout && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="inherit"
                sx={{ mt: 2 }}
                onClick={() => {
                  props.onConfirmCheckout();
                  props.onClick();
                }}
              >
                Proceed
              </Button>
            </Box>
          )}
        </Alert>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
