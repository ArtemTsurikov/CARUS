import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { AuthContext } from "./context/auth-context";
import * as React from "react";
import { useAuth } from "./hooks/auth-hook";
import ProtectedRoutes from "./components/Routing/ProtectedRoutes";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import LandingPage from "./pages/LandingPage";
import ErrorPage from "./pages/ErrorPage";
import CarProfilePage from "./pages/CarProfilePage";
import CarSearchPage from "./pages/CarSearchPage";
import OfferOverviewPage from "./pages/OfferOverviewPage";
import RentalRequestPage from "./pages/RentalRequestPage";
import RentalDetailsDialog from "./components/Rentals/RentalDetailsDialog";
import WhyCarusPage from "./pages/WhyCarusPage";
import TermsOfService from "./pages/TermsOfService";
import Imprint from "./pages/Imprint";
import Support from "./pages/Support";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RequestOverviewPageAsSharer from "./pages/RequestOverviewPageAsSharer";
import RequestOverviewPageAsRequester from "./pages/RequestOverviewPageAsRequester";

const App = () => {
  /* Managing the visual representation of logged in & not loggde in users */
  const { token, login, logout, userId, user } = useAuth();
  const [rentalRequestDialog, setRentalRequestDialog] = React.useState(true);

  const handleRentalRequestDialog = () => {
    setRentalRequestDialog(!rentalRequestDialog);
    window.location = `/profile/${userId}`;
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: token,
        userId: userId,
        token: token,
        login: login,
        logout: logout,
        user: user,
      }}
    >
      <Router>
        <Switch>

          {/* All unprotected routes */}
          <Route path="/" component={LandingPage} exact></Route>
          <Route path="/login" component={LoginPage} exact></Route>
          <Route path="/signup" component={SignUpPage} exact></Route>
          <Route path="/whyCarus" component={WhyCarusPage} exact></Route>
          <Route path="/termsOfService" component={TermsOfService} exact></Route>
          <Route path="/imprint" component={Imprint} exact></Route>
          <Route path="/support" component={Support} exact></Route>
          <Route path="/forgotPassword" component={ForgotPassword} exact></Route>
          <Route path="/resetPassword/:token" component={ResetPassword} exact></Route>

         {/*  All protected routes */}
          <ProtectedRoutes path="/profile/:_id" exact>
            <ProfilePage/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/profile/:_id/rentalRequest/:_requestId" exact>
          <RentalDetailsDialog
            open={rentalRequestDialog}
            close={handleRentalRequestDialog}
          />
          </ProtectedRoutes>
          <ProtectedRoutes path="/car/:_id" exact>
            <CarProfilePage/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/myOffers" exact>
            <OfferOverviewPage/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/mySharings" exact>
            <RequestOverviewPageAsSharer/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/myRequests" exact>
            <RequestOverviewPageAsRequester/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/searchCar" exact>
            <CarSearchPage/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/requestRental/:_id" exact>
            <RentalRequestPage/>
          </ProtectedRoutes>
          <ProtectedRoutes path="/requestRental/:_id/requestDetailsSuccess" exact>
            <RentalRequestPage success={true} />
          </ProtectedRoutes>
          <ProtectedRoutes path="/requestRental/:_id/requestDetailsFailure" exact>
            <RentalRequestPage success={false} />
          </ProtectedRoutes>
          {/* Error Route */}
          <ProtectedRoutes path="*">
            <ErrorPage></ErrorPage>
          </ProtectedRoutes>
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
