import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import ProductAlbum from "../components/Product/ProductAlbum";
import ProductPricing from "../components/Product/ProductPricing";
import Footer from "../components/Navigation/Footer";
import ProductHowItWorks from "../components/Product/ProductWork";
import Features from "../components/Product/ProductFeature";
import Post from "../components/Product/ProductPost";
import ProductHowToMakeMoney from "../components/Product/ProductMoney";
import Securities from "../components/Product/ProductSecurity";
import Munich from "../components/Product/ProductMunich";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const defaultTheme = createTheme();

const WhyCarusPage = () => {
  return (
    <React.Fragment>
      <NavBarNew/>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <main>
          <Post/>
          <ProductHowItWorks/>
          <Features/>
          <ProductHowToMakeMoney/>
          <Securities/>
          <ProductPricing/>
          <Munich/>
        </main>
        <Footer/>
      </ThemeProvider>
    </React.Fragment>
  );
}
export default WhyCarusPage;


/** 
<AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Company name
          </Typography>
          <nav>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Features
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Enterprise
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Support
            </Link>
          </nav>
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
<AppBar position="relative">
<Toolbar>
  <CameraIcon sx={{ mr: 2 }} />
  <Typography variant="h6" color="inherit" noWrap>
    Album layout
  </Typography>
</Toolbar>
</AppBar>

const serviceList = [
  "Share Mobility(as Borrower)",
  "Become a Sharer",
  "Insurance",
];

const WhyCarusPage = () => {
  return (
    <Container>
      <NavBarNew />
      <Typography
        variant="h3"
        sx={{ textAlign: "center", marginTop: "2rem", color: "primary.main" }}
      >
        Why Carus?
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {serviceList.map((service) => (
          <Paper elevation={4} sx={{ marginTop: "2rem", padding: "1rem" }}>
            <Box sx={{ m: 3 }}>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "primary.main" }}
              >
                {service}
              </Typography>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", marginTop: "1rem" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc,
                eget aliquam nisl nunc eget nisl. Donec euismod, nisl eget
                ultricies aliquam, nunc nisl aliquet nunc, eget aliquam nisl
                nunc eget nisl.
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  );
};
*/