import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import MainPage from "./MainPage";
import RedirectOnCtrlR from "./RedirectOnCtrlR"; // For redirecting on Ctrl + R
import { AuthProvider } from "./AuthContext"; // Import the AuthProvider
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component

function App() {
  return (
    <AuthProvider> {/* Wrap the app in the AuthProvider */}
      <Router>
        <RedirectOnCtrlR /> {/* Redirect on Ctrl + R */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected route for /mainpage */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mainpage" element={<MainPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
