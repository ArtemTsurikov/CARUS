import * as React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
  } from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import KeyIcon from '@mui/icons-material/Key';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 3,
};

const number = {
  fontSize: 23,
  fontFamily: 'default',
  color: 'primary.main',
  fontWeight: 'bold',
  p:1,
};

const icon = {
    fontSize: 60,
    height: 55, 
    my: 2,
    color: 'primary.main',
    fontWeight: 'bold',
    };

function ProductHowItWorks() {
  return (
    <Box component="section" sx={{ display: 'flex', bgcolor: '#ffffff', overflow: 'hidden' }}>
      <Container
        sx={{
          mt: 5,
          mb: 5,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
              component="h2"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              How to rent a car with us
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{pb: 3}}>
              Having the most flexible car sharing platform, we offer you the best way to rent a car. You can choose from a wide range of cars and book them for a few hours or days.
            </Typography>
            <Grid container sx={{ display: 'flex', justifyContent: 'center', justifyItems: "space-evenly", align: "strecht"}} columns={25}>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <DirectionsCarIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Choose a car
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <DateRangeIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Select time slot
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <ForwardToInboxIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Send a request
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>4.</Box>
                <KeyIcon sx={icon} />
                <Typography variant="h5" align="center">
                    Collect the car
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>5.</Box>
                <RocketLaunchIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Start your trip
                </Typography>
              </Box>
            </Grid>
        </Grid>
        <Button
          color="primary"
          size="large"
          variant="contained"
          component="a"
          href="/searchCar"
          sx={{ mt: 8, height: 60, width: 300, fontSize: 20 }}
        >
          Find your car
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowItWorks;