import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard"; // Import your Dashboard component
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import RegisterPage from "./pages/register/register";
import LoginPage from "./pages/login/login";


const App = () => {
  return (
    <ThemeProvider>
    <Router>
      <LoginPage />
      
    </Router>
    </ThemeProvider>
  );
};

export default App;
