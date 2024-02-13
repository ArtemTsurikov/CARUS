import * as React from 'react';
import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Container, CssBaseline,GlobalStyles, Grid, Link, Paper, Stack, Typography, Toolbar} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/StarBorder';


const tiers = [
  {
    title: "Baisc",
    price: "3",
    description: [
      "Full coverage for damage to your car",
      "Full coverage for damage to passengers",
      "Partial coverage for damage to third party cars",
      "Partial coverage for damage to third party property",
    ],
  },
  {
    title: "Advanced",
    price: "6",
    description: [
      "Full coverage for damage to your car",
      "Full coverage for damage to third party cars",
      "Full coverage for damage to third party property",
      "Full coverage for damage to passengers",
      "Coverage of towing costs",
    ],
  },
];

const defaultTheme = createTheme();
function ProductPricing() {
  return (
    <Container sx={{ pb: 15 }} maxWidth="xl" disableGutters>
      <Container
        disableGutters
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Insurance packages
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          Our insurance packages are designed to give you the best possible protection. 
          As a Sharer or Renter, you are automatically covered by our basic insurance package. 
          You can also choose to upgrade to our advanced insurance package for extra peace of mind.
        </Typography>
      </Container>

      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              md={6}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  titleTypographyProps={{ align: "center" }}
                  action={tier.title === "Advanced" ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: "center",
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography
                      component="h2"
                      variant="h3"
                      color="text.primary"
                    >
                      ${tier.price}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /rental
                    </Typography>
                  </Box>
                  <ul>
                    {tier.description.map((features) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={features}
                      >
                        {features}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Container>
  );
}

export default ProductPricing;
