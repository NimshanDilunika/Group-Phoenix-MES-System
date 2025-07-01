import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Dashboard from "./components/Dashboard/Dashboard";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import LogoutPage from './components/Logout/logout';
import UserList from './components/UserList/UserList'; // import the new component
import ProfileSettings from './pages/Profile/ProfileSettings'; // import ProfileSettings
import { CompanySettingsProvider } from "./context/CompanySettingsContext";

// PrivateRoute component to guard routes requiring authentication
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <ThemeProvider>
      <CompanySettingsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/users" element={<UserList />} /> {/* ✅ New route */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileSettings />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </CompanySettingsProvider>
    </ThemeProvider>
  );
};

export default App;
