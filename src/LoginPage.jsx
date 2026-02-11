import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./LoginPage.css";
import logo1 from "./assets/PRASHNAANSH.png";
import CombinedView from "./CombinedView";

function LoginPage() {
  const [otp, setOTP] = useState(Array(6).fill(""));
  const [showOTP, setShowOTP] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        setErrorMessage("");
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {!showOTP ? (
        <form onSubmit={handleLogin} className="login-form">
          <div className="logo-container">
            <img src={logo1} className="logo1" alt="system-logo" />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              name="username" 
              type="text" 
              placeholder="Enter your username" 
              required 
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                name="password" 
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password" 
                required 
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {errorMessage && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errorMessage}
            </div>
          )}
          
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Please wait...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="otp-form">
          <div className="otp-header">
            <div className="otp-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <h2>Verify OTP</h2>
            <p>Enter the 6-digit code sent to your email</p>
          </div>
          
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
          
          {errorMessage && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errorMessage}
            </div>
          )}
          
          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? (
              <>
                <span className="button-spinner"></span>
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
          
          {verificationStatus === "success" && (
            <div className="status success">
              <span className="icon">✔</span> 
              OTP Verified Successfully
            </div>
          )}
          {verificationStatus === "failure" && (
            <div className="status failure">
              <span className="icon">✘</span> 
              Invalid OTP. Please try again
            </div>
          )}
        </form>
      )}
      {/* <CombinedView/> */}
    </div>
  );
}

export default LoginPage;