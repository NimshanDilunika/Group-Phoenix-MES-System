import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard"; // Import your Dashboard component

const App = () => {
  return (
    <ThemeProvider>
    <Router>
      <Dashboard />
    </Router>
    </ThemeProvider>
  );
};

export default App;
