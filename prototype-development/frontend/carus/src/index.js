import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";


/**
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material";
const theme = createTheme({
    palette: {
        primary: {
            main: "#000000",
            light: "#ffffff",
            dark: "#000000",
        },
        secondary: {
            main: "#0449c7",
            light: "#13c4dc",
            dark: "#042749",
        },
       info: {
            main: "8a00c2",
            light: "#b100cd",
            dark: "#4c00b0",
       },
    },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
        <App />
        </ThemeProvider>
    </React.StrictMode>
)
**/
const root = document.getElementById("root");
render(<App />, root);