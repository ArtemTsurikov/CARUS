import * as React from "react";
import NavBarNew from "../components/Navigation/NavBar";
import Footer from "../components/Navigation/Footer";
import { Container, ListItemText, Typography, List, ListItem } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


const defaultTheme = createTheme();

const TermsOfService = () => {
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
                    Carus - Share Mobility: Terms of Service
                </Typography>
                <Typography variant="h5" align="left" color="text.secondary" paragraph sx={{pb: 3}}>
                    Welcome to Carus, a car sharing platform that allows you to access vehicles conveniently. 
                    By using our services, you agree to comply with the following detailed terms and conditions. 
                    Please read them carefully before accessing or using the Carus platform.
                </Typography>
                <List sx={{  listStyleType: 'decimal', pl: 2, '& .MuiListItem-root': { display: 'list-item',}, bgcolor: 'background.paper' }} >
                    <ListItem>
                        <ListItemText primary="Acceptance of Terms" />
                        <ListItemText secondary="By registering and using Carus, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. These terms constitute a legally binding agreement between you and Carus. If you do not agree with any part of these terms, you may not use our platform." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="User Eligibility" />
                        <ListItemText secondary="You must be at least 18 years old or the legal age of majority in your jurisdiction to register and use Carus. By using our platform, you represent and warrant that you have the legal capacity to enter into this agreement and abide by its terms." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="User Account and Information" />
                        <ListItemText secondary="When creating a Carus account, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must promptly notify Carus of any unauthorized use or suspected security breach of your account." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Usage and Safety" />
                        <ListItemText secondary="Carus vehicles must be used in compliance with all applicable laws, regulations, and traffic rules of the jurisdiction in which you operate the vehicle. You must operate Carus vehicles responsibly, exercising caution and diligence at all times. Engaging in reckless driving, speeding, racing, or any illegal activities while using Carus vehicles is strictly prohibited." />
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Booking and Payment" />
                        <ListItemText secondary="You can book Carus vehicles through the platform for specific time slots. Payment for the car-sharing service will be processed through the platform's secure payment system. By booking a vehicle, you agree to pay the specified rental fee, which includes the rental cost and any additional charges incurred during your rental period."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Insurance" />
                        <ListItemText secondary="Carus vehicles are covered by third-party liability insurance. The insurance policy covers the vehicle and its occupants in the event of an accident. The insurance policy does not cover any damage to the vehicle caused by the driver's negligence or misuse."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Cancellation and Refund" />
                        <ListItemText secondary="You may cancel your booking at any time before the start of your rental period. The cancellation fee will be deducted from your account balance. If you cancel your booking within 24 hours of the start of your rental period, you will be charged the full rental fee."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Condition and Cleanliness" />
                        <ListItemText secondary="You must return the Carus vehicle in the same condition it was in at the beginning of the rental period, with no new damages or issues. You are responsible for any damages caused to the vehicle during your rental period. Carus reserves the right to charge you for any necessary repairs or cleaning resulting from your use of the vehicle."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Liability" />
                        <ListItemText secondary="Carus is not responsible for any damages or injuries caused by the use of our platform or vehicles. You agree to indemnify and hold harmless Carus from any claims, damages, losses, liabilities, and expenses arising out of or related to your use of our platform or vehicles."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Availability" />
                        <ListItemText secondary="Carus vehicles are available on a first-come, first-served basis. If a vehicle is not available at the time of your booking, you will be notified and given the option to book another vehicle or cancel your booking."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Return" />
                        <ListItemText secondary="You must return the Carus vehicle to the designated parking spot at the end of your rental period. If you fail to return the vehicle on time, you will be charged a late fee. If you fail to return the vehicle within 24 hours of the end of your rental period, you will be charged the full rental fee."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Maintenance" />
                        <ListItemText secondary="Carus vehicles are maintained by the vehicle owner. If you notice any issues with the vehicle during your rental period, please contact us immediately so that we can address the issue as soon as possible."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Damage" />
                        <ListItemText secondary="You are responsible for any damage caused to the Carus vehicle during your rental period. If you notice any damage to the vehicle, please contact us immediately so that we can address the issue as soon as possible."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Vehicle Theft" />
                        <ListItemText secondary="If the Carus vehicle is stolen during your rental period, you must notify us immediately so that we can take appropriate action. You are responsible for any damages caused to the vehicle as a result of theft."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Privacy Policy" />
                        <ListItemText secondary="Carus collects personal information from you when you register for an account and use our platform. We use this information to provide you with our services and improve our platform. We may also share your information with third parties for marketing purposes. By using our platform, you agree to our Privacy Policy."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Changes to Terms of Service" />
                        <ListItemText secondary="Carus reserves the right to modify these Terms of Service at any time. We will notify you of any changes by posting the new Terms of Service on this page. You are advised to review these Terms of Service periodically for any changes. Your continued use of our platform constitutes acceptance of these changes."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="User Conduct" />
                        <ListItemText secondary="You agree not to use our platform for any unlawful purpose or in any way that violates these Terms of Service. You also agree not to use our platform in any way that could damage, disable, overburden, or impair the platform or interfere with any other party's use and enjoyment of the platform.  You must treat other users with respect and follow Carus's guidelines and community standards. Any abusive, offensive, or inappropriate behavior is strictly prohibited and may result in the suspension or termination of your Carus account."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Termination" />
                        <ListItemText secondary="Carus reserves the right to suspend or terminate your account at any time for any reason. We may also suspend or terminate your account if we believe that you have violated these Terms of Service or our Community Guidelines."/>
                    </ListItem>
                    <ListItem>
                        <ListItemText primary="Disclaimer of Warranties" />
                        <ListItemText secondary="Carus provides our platform on an 'as is' and 'as available' basis. We do not warrant that our platform will be uninterrupted or error-free, or that any defects in the platform will be corrected. We do not warrant that the platform will meet your requirements or that the platform will be compatible with your device. We do not warrant that the platform will be free of viruses or other harmful components. We do not warrant that the results of using the platform will meet your expectations. We do not warrant that the platform will be available at all times or in all locations. We do not warrant that the platform will be secure or that your information will not be intercepted by third parties. We do not warrant that the platform will be free of errors or that any errors will be corrected. We do not warrant that the platform will be free of bugs or that any bugs will be fixed. We do not warrant that the platform will be free of viruses or other harmful components."/>
                    </ListItem>
                </List>
                <Typography variant="h5" gutterBottom>
                    By using Carus, you acknowledge that you have read, understood, and agreed to these detailed Terms of Service. If you do not agree to these terms, you may not use our services.
                </Typography>
            </Container>
            <Footer />
        </ThemeProvider>
    </div>
  );
};

export default TermsOfService;