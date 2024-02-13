import * as React from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Button,
  } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GradingIcon from '@mui/icons-material/Grading';
import CarRentalIcon from '@mui/icons-material/CarRental';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

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

function ProductHowToMakeMoney() {
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
              How to make money with us
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{pb: 3}}>
              Renting out your car is easy and safe with us. You can choose when, where and whom to rent out your car to. 
              You can also set your own price and we will take care of the rest. 
              With sharing your car with us you not only make a passive income but also help create a more livable city by reducing the number of cars on the road and creating a community of sharers.
            </Typography>
        <Grid container sx={{ display: 'flex', justifyContent: 'center', justifyItems: "space-evenly", align: "strecht"}} columns={25}>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>1.</Box>
                <FileUploadIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Upload your car
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>2.</Box>
                <EventAvailableIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Set availability
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>3.</Box>
                <GradingIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Review requests
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>4.</Box>
                <CarRentalIcon sx={icon} />
                <Typography variant="h5" align="center">
                    Share the key
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box sx={item}>
                <Box sx={number}>5.</Box>
                <AttachMoneyIcon sx={icon} />
                <Typography variant="h5" align="center">
                  Get paid
                </Typography>
              </Box>
            </Grid>
        </Grid>
        <Button
          color="primary"
          size="large"
          variant="contained"
          component="a"
          href="/myOffers"
          sx={{ mt: 8, height: 60, width: 300, fontSize: 20}}
        >
          Create your offer
        </Button>
      </Container>
    </Box>
  );
}

export default ProductHowToMakeMoney;