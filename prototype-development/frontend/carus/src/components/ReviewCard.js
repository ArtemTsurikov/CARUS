import * as React from "react";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ReviewCard = (props) => {
  const history = useHistory();
  return (
    <Card sx={{ mr: 5 }}>
      <CardHeader
        title={props.review?.title}
        titleTypographyProps={{ align: "center", variant: "h4" }}
      ></CardHeader>
      <CardContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item sx={{ width: "10%" }}>
            {props.multipleCards && (
              <IconButton
                onClick={(e) => {
                  props.updateFunction("left", "review");
                }}
              >
                <NavigateNextIcon
                  sx={{ transform: "rotate(180deg)" }}
                ></NavigateNextIcon>
              </IconButton>
            )}
          </Grid>
          <Grid item sx={{ width: "25%" }}>
            <CardActionArea href={`/profile/${props.review?.reviewingUser}`}>
              <Avatar
                src={props.picture?.src}
                sx={{
                  width: { xs: 64, md: 84, lg: 128 },
                  height: { xs: 64, md: 84, lg: 128 },
                }}
              ></Avatar>
            </CardActionArea>
          </Grid>
          <Grid item sx={{ width: "60%" }}>
            <Typography variant="body1" color="text.secondary">
              {props.review?.content}
            </Typography>
          </Grid>
          <Grid item sx={{ width: "5%" }}>
            {props.multipleCards && (
              <IconButton
                onClick={(e) => {
                  props.updateFunction("right", "review");
                }}
              >
                <NavigateNextIcon></NavigateNextIcon>
              </IconButton>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
