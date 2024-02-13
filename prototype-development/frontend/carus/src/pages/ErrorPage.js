import * as Reacht from "react"
import NavBar from "../components/Navigation/NavBar";
import { Grid, Typography } from "@mui/material";
import Footer from "../components/Navigation/Footer";
import MinorCrashIcon from '@mui/icons-material/MinorCrash';


const ErrorPage = () => {


    return (
        <div height = "100%">
        <NavBar/>
            <Grid container justifyContent="center" padding={10}>
                <Grid item align="center">
                    <MinorCrashIcon sx={{ fontSize: 100, p:4 }} color="primary"/>
                    <Typography variant="h1">
                        404
                    </Typography>
                    <Typography variant="h3"> 
                        Sorry, the road you are taking does not exist.
                    </Typography>
                </Grid>
            </Grid>
        <Footer/>
        </div>
        
    )
}

export default ErrorPage