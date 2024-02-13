import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Container } from '@mui/material';
import insurance from '../../icons/insurance.jpg';
import support from '../../icons/support.jpg';

const content = [
    {
        title: 'Our partners are your partners too',
        description:
            'We know that live can be unpredictable sometimes and accidents happen. Our strong insurance policy will cover any damage to your car, so you can rest assured that your car is in safe hands. Our partner Allianz is one of the biggest insurance companies in the world and they know how your car is secured the best. They will take care of you, your car and your passengers.',
        image: insurance,
        imageLabel: 'Insurance',
    },
    {
        title: 'Our customer support team is always there for you',
        description:
            'For any unforeseen events, our customer support team is always ready to help you. We are here to help you find the right car for your needs. If you either need assistance with your booking or have any questions about our service, our team of expeerts know how to handle any situation. Our customer support team is available 24/7 and will be happy to assist you.',
        image: support,
        imageLabel: 'Customer support',
    },
  ];
  
function securityPost(post) {
  return (
    <Grid key={post.title} item xs={12} sm={6} md={4} lg={5} xl={5}>
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

function featureCard(post) {
    <Container disableGutters>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {post.description}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Continue reading...
            </Typography>
          </CardContent>
          <CardMedia
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image={post.image}
            alt={post.imageLabel}
          />
        </Card>
    </Container>
}

function Securities() {
    return(
    <Container sx={{ py: 15 }} maxWidth="xl" disableGutters>
        <Typography
              component="h2"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Your safety is our priority
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph sx={{pb: 3}}>
            When sharing your car with others, you want to make sure that your car is in good hands and we want to make sure that you are in good hands. 
            That's why we have developed a comprehensive safety concept to ensure that you can share your car with others without any worries to give you peace of mind. 
            With our transparent review system, you can see what other people think about the person who wants to rent your car. 
            You can also see how many trips they have already made and how many reviews they have received. 
            This way you can make sure that your car is in good hands.
        </Typography>
        <Grid container spacing={4} justifyItems="center" justifyContent="space-evenly">
            {content.map((post) => (
                securityPost(post)
            ))}
        </Grid>
    </Container>
    );
}

export default Securities;