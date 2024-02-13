import * as React from "react";
import { Box, Container, Grid, Link, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Footer() {
  return (
    <Container maxWidth="lg" component="footer" sx={{ mt: 5, mb: 5 }}>
      <Grid container sx={{ pt: 4 }} justifyContent={"center"} spacing={3}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">
            <Link href="/imprint" color="text.secondary" underline="hover">
              Imprint
            </Link>
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">
            <Link
              href="/termsOfService"
              color="text.secondary"
              underline="hover"
            >
              Terms of service
            </Link>
          </Typography>
        </Box>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5">
            <Link href="/support" color="text.secondary" underline="hover">
              Contact Support
            </Link>
          </Typography>
        </Box>
      </Grid>
      <Grid container sx={{ pt: 4, pb: 4 }} justifyContent={"center"}>
        <Typography color="text.secondary" justifyContent={"center"}>
          Made with <FavoriteIcon sx={{ color: "blue" }} /> in Munich. Copyright
          © Carus {new Date().getFullYear()}.
        </Typography>
      </Grid>
    </Container>
  );
}

export default Footer;
