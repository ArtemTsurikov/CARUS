import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container } from '@mui/material';
import adventureTruck from '../../icons/adventureTruck.jpg';
import carSharingGirls from '../../icons/carShareGirls.jpg';
import carFamily from '../../icons/carFamily.jpg';

const content = [
    {
      title: 'Share your car with people nearby',
      description:
        "Your car is your second biggest investment and 90% of the time it's parked and not in use. Why not share it with people nearby and earn some extra money? We are here to connect you find the right people to share your car with. Sign up today and start earning money tomorrow.",
      image: carSharingGirls,
      imageLabel: 'People sharing a car',
    },
    {
      title: 'Find a car for every occasion',
      description:
        'A driving license is all you need to get started. Find a car for every occasion, from a small city car to a big family van or a sporty convertible for a weekend trip. We are here to connect you find the right people with the right car for your needs.',
      image: adventureTruck,
      imageLabel: 'Truck driving through water',
    },
    {
        title: 'Become part of the family',
        description:
          'We are a community of people who love to share. We are here to help you find the right car for your needs. Sign up today, get to know your neighbors and become part of the family. Our community is growing every day and we are looking forward to welcoming you.',
        image: carFamily,
        imageLabel: 'Family in a car',
      },
  ];
  
function featurePost(post) {
  return (
    <Grid key={post.title} item xs={12} sm={6} md={4} lg={5} xl={4}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, boxShadow: 3}}>
            <CardMedia sx={{pt: '50%'}} image={post.image}/>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                {post.title}
                </Typography>
                <Typography>
                {post.description}
                </Typography>
            </CardContent>
        </Card>
     </Grid>
  );
}

function Features() {
    return(
    <Container sx={{ py: 15 }} maxWidth="xl" disableGutters>
        <Typography
              component="h2"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Why you should join us
    </Typography>
        <Grid container spacing={4} justifyItems="center" justifyContent="space-evenly">
            {content.map((post) => (
                featurePost(post)
            ))}
        </Grid>
    </Container>
    );
}

export default Features;