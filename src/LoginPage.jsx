import React, { useState } from "react";
import "./LoginPage.css";
// import logo from "./assets/logo.png";
import logo1 from "./assets/logo1.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username && password) {
      setShowOTP(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the OTP to your server for verification
    console.log("Submitting OTP:", otp);
  };

  return (
    <div className="login-page">
      {!showOTP ? (
        <form onSubmit={handleLogin}>
          <div className="logo-container">
            {/* <img src={logo} className="logo" alt="college-logo" /> */}
            <img src={logo1} className="logo1" alt="system-logo" />
          </div>
          {/* <h1>Login</h1> */}
          <label htmlFor="username">Username : </label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="password">Password : </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Log In</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}

export default LoginPage;
