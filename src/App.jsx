// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Dashboard from "./components/Dashboard/Dashboard";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import LogoutPage from './components/Logout/logout';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} /> {/* Route for your login page */}
          <Route path="/login" element={<LoginPage />} /> {/* Route for your login page */}
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} /> {/* Route for your dashboard */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;