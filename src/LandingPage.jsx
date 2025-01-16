import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "./assets/logo.png";
import logo1 from "./assets/logo1.png";

function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      navigate("/login");
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="landing-page" onClick={handleClick}>
      <div className="content">
        <div className="logo-container">
          <img src={logo} className="logo" alt="College Logo" />
          <img src={logo1} className="logo1" alt="System Logo" />
        </div>
        <h1 className="system-name typing-effect">
          Welcome to <span className="system-name-main">Exam Engine</span>
        </h1>
      </div>
    </div>
  );
}

export default LandingPage;
