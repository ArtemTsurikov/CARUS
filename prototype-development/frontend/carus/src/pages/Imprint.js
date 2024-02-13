import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import Footer from "../components/Navigation/Footer";
import { Container, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import monster from "../icons/monster.jpg";
import elmo from "../icons/elmo.jpg";
import oscar from "../icons/oscar.jpg";
import grover from "../icons/grover.jpg";



const people = [
    {
        title: 'Artemiy van Tsurikov',
        image: elmo,
        imageLabel: 'Elmo',
    },
    {
        title: 'Tim Cremer',
        image: grover,
        imageLabel: 'Grover',
    },
    {
        title: 'Stefan Janker',
        image: oscar,
        imageLabel: 'Oscar',
      },
    {
        title: 'Tim Obertrifter',
        image: monster,
        imageLabel: 'Cookie Monster',
    },
  ];

  const equipment = ['ABS', 'Airbags', 'Apple CarPlay'];

  function peoplePost(post) {
    return (
      <Grid key={post.title} item xs={12} sm={6} md={4} lg={5} xl={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, boxShadow: 3}}>
              <CardMedia sx={{pt: '50%'}} image={post.image}/>
              <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                  {post.title}
                  </Typography>
              </CardContent>
          </Card>
       </Grid>
    );
  }

const defaultTheme = createTheme();

const Imprint = () => {
  return (
    <div>
        <NavBarNew />
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <Container sx={{ py: 5 }} maxWidth="xl" disableGutters >
                <Typography
                    component="h2"
                    variant="h2"
                    align="left"
                    color="text.primary"
                    gutterBottom
                    >
                    Carus - Share Mobility: Imprint
                </Typography>
                <Typography variant="h5" align="left" color="text.secondary" paragraph sx={{pb: 3}}>
                    We are a team of students from the Technical University of Munich. We are developing a platform for sharing mobility.
                </Typography>
                <Grid container spacing={4} justifyItems="center" justifyContent="space-evenly">
                    {people.map((post) => (
                    peoplePost(post)
                    ))}
                </Grid>
            </Container>
            <Footer />
        </ThemeProvider>
    </div>
  );
};

export default Imprint;