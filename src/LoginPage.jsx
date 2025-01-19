import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";
import logo1 from "./assets/logo1.png";
import { LoginLogs } from "./login-logs";

function LoginPage() {
  const [otp, setOTP] = useState(Array(6).fill(""));
  const [showOTP, setShowOTP] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const formUsername = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formUsername,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUsername(formUsername);
        setShowOTP(true);
        setErrorMessage("OTP has been sent to harshadkarale22@pccoepune.org");
      } else {
        setErrorMessage(data.message || "Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const enteredOtp = otp.join("");

    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          otp: enteredOtp
        })
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus("success");
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          login();
          navigate("/mainpage");
        }, 1000);
      } else {
        setVerificationStatus("failure");
        setErrorMessage(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setVerificationStatus("failure");
      setErrorMessage("An error occurred during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOTP(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    if (!value && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
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
          <input 
            name="username" 
            type="text" 
            placeholder="Username" 
            required 
            disabled={isLoading}
          />
          <label htmlFor="password">Password:</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            disabled={isLoading}
          />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Please wait..." : "Log In"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="otp">Enter OTP sent to your email:</label>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="otp-box"
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength="1"
                required
                disabled={isLoading}
              />
            ))}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
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
      <LoginLogs/>
    </div>
  );
}

export default LoginPage;