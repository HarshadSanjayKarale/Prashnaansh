import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";
import logo1 from "./assets/logo1.png";

function LoginPage() {
  const [otp, setOTP] = useState(Array(6).fill("")); // Initialize 6 boxes for OTP
  const [showOTP, setShowOTP] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(""); // "success" or "failure"
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded username and password
    const hardcodedUsername = "PccoeExam";
    const hardcodedPassword = "Pccoe@1999";

    const username = e.target.username.value;
    const password = e.target.password.value;

    if (username === hardcodedUsername && password === hardcodedPassword) {
      setShowOTP(true); // Show OTP form if login details are correct
    } else {
      alert("Invalid username or password. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const enteredOtp = otp.join(""); // Combine the OTP boxes into a single string
    console.log("OTP Submitted:", enteredOtp);

    // Hardcoded OTP for verification
    const hardcodedOtp = "123456";

    if (enteredOtp === hardcodedOtp) {
      setVerificationStatus("success");
      setTimeout(() => {
        login();
        navigate("/mainpage"); // Redirect to /mainpage after 2 seconds
      }, 1000);
    } else {
      setVerificationStatus("failure");
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1); // Only allow one digit per box
    setOTP(newOtp);

    // If a digit is entered, move to the next box
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // If backspace is pressed, move to the previous box if the current box is empty
    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle left and right arrow keys to navigate between OTP boxes
    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="login-page">
      {!showOTP ? (
        <form onSubmit={handleLogin}>
          <div className="logo-container">
            <img src={logo1} className="logo1" alt="system-logo" />
          </div>
          <label htmlFor="username">Username:</label>
          <input name="username" type="text" placeholder="Username" required />
          <label htmlFor="password">Password:</label>
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Log In</button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">OTP:</label>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-box"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} // Listen for keydown event
                maxLength="1"
                required
              />
            ))}
          </div>
          <button type="submit">Verify OTP</button>
          {verificationStatus === "success" && (
            <div className="status success">
              <span className="icon">✔</span> OTP Verified Successfully.
            </div>
          )}
          {verificationStatus === "failure" && (
            <div className="status failure">
              <span className="icon">✘</span> Invalid OTP. Please try again.
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default LoginPage;
