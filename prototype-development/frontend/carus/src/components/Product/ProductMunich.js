import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import munich from '../../icons/munich.jpg';

const post = {
    title: 'Our center of operations - Munich',
    description:
    "Munich is our home base and is the first city where we are launching our service. We want to make sure to provide the best service possible to the people of Munich and help keep the city as liveable as possible. Therefore we are partnering with the city of Munich to provide unique advantages to our members.", 
    image: munich,
    imageText: 'Munich Ludwigstrasse'
  };

function Munich() {
  return (
    <Box component="section" sx={{ 
        display: 'flex', 
    position: 'relative',
    backgroundColor: 'grey.800',
    color: '#fff',
    mb: 4,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '25% 75%',
    backgroundImage: `url(${post.image})`}}>
        <Container disableGutters
        sx={{ pt: 5, pb: 5 }}>
            <Box
                sx={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: 'rgba(0,0,0,.3)',
                }}
            />
            <Grid container justifyContent={'end'}>
                <Grid item md={8}>
                    <Box
                        sx={{
                        position: 'relative',
                        p: { xs: 3, md: 10 },
                        pr: { md: 0 },
                        }}
                    >
                        <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                        {post.title}
                        </Typography>
                        <Typography variant="h5" color="inherit" paragraph>
                        {post.description}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    </Box>
  );
}

export default Munich;