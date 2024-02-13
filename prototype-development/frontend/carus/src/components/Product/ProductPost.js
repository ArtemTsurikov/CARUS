import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import bmwDriving from '../../icons/bmwDriving.jpg';

const post = {
    title: 'CARUS - Share Mobility',
    description:
    "Carus connects people who need a car with people who have a car. We are a car sharing platform that allows you to rent or share a car with people nearby.", 
    image: bmwDriving,
    imageText: 'main image description'
  };

function Post() {
  return (
    <Box component="section" sx={{ 
        display: 'flex', 
    position: 'relative',
    backgroundColor: 'grey.800',
    color: '#fff',
    mb: 4,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
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
            <Grid container>
                <Grid item md={6}>
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

export default Post;