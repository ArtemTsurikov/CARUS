import NavBar from "../components/Navigation/NavBar";
import { Button, Container } from "@mui/material";
import background from "../icons/LP.jpg";

const LandingPage = () => {
  return (
    <div>
      <NavBar />
      <Container
        maxWidth="false"
        sx={{
          backgroundImage: `url(${background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "87vh",
        }}
      >
        <Button
          variant="contained"
          href= "/myOffers"
          sx={{
            left: "65%",
            top: "30%",
            position: "absolute",
            width: 1 / 4,
            height: 1 / 8,
            bgcolor: "black",
            fontWeight: "bold",
            fontSize: 20,
            "&:hover": { bgcolor: "#005778", color: "white" },
          }}
        >
          Share a car
        </Button>
        <Button
          variant="contained"
          href="/searchCar"
          sx={{
            left: "65%",
            top: "60%",
            position: "absolute",
            width: 1 / 4,
            height: 1 / 8,
            bgcolor: "black",
            fontWeight: "bold",
            fontSize: 20,
            "&:hover": { bgcolor: "#005778", color: "white" },
          }}
        >
          Rent a car
        </Button>
      </Container>
    </div>
  );
};

export default LandingPage;
