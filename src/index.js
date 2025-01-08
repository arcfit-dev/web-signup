import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import {createTheme, ThemeProvider} from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#9C0064", // Customize primary color
        },
        background: {
            default: "#121212", // Background color
            paper: "#1e1e1e", // Card or paper background
        },
        text: {
            primary: "#ffffff", // Text color
            secondary: "#aaaaaa",
        },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
      <Router>
      <Routes>
        <Route path="/web-signup/:event?" element={<App />} />
      </Routes>
    </Router>
      </ThemeProvider>
  </React.StrictMode>
);
