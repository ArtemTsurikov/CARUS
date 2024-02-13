import * as React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  Paper,
  TableCell,
  Button,
  TableBody,
  TablePagination,
} from "@mui/material";
import { CarContext } from "../../context/car-context";
import { AuthContext } from "../../context/auth-context";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CarTimeTable = () => {
  const { car, carOffers, userCanEditPage } = React.useContext(CarContext);
  const auth = React.useContext(AuthContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [availableCarOffers, setAvailableCarOffers] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    if (carOffers) {
      setAvailableCarOffers(carOffers.filter((carOffer) => carOffer.available));
    }
  }, [carOffers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDateFormatOfDay = (dateString) => {
    const launchDate = new Date(dateString);
    const futureDate = new Date();
    futureDate.setTime(launchDate.getTime());

    const day = futureDate.toLocaleString("en-us", { weekday: "long" });
    const date = dateString.slice(0, 10);
    const time = dateString.slice(11, 16);

    return `${day}, ${date}, ${time} `;
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Weekday - Startday - Start time</strong>
            </TableCell>
            <TableCell>
              <strong>Weekday - End day - End time</strong>
            </TableCell>
            <TableCell>
              <strong>Price per hour</strong>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {availableCarOffers
            ? availableCarOffers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((carOffer) => (
                  <TableRow key={carOffer._id}>
                    <TableCell>
                      {getDateFormatOfDay(carOffer.offerStartDateTime)}
                    </TableCell>
                    <TableCell>
                      {getDateFormatOfDay(carOffer.offerEndDateTime)}
                    </TableCell>
                    <TableCell>{carOffer.pricePerHour}</TableCell>

                    {!userCanEditPage && (
                      <TableCell>
                        <Button href={"/requestRental/" + carOffer._id}>
                          Rent
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            : null}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[1, 5, 10]}
        component="div"
        count={availableCarOffers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default CarTimeTable;
