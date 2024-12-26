import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "./assets/logo.png";
import logo1 from "./assets/logo1.png";

function LandingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page" onClick={handleClick}>
      <div className="content">
        <div className="logo-container">
          <img src={logo} class="logo" alt="College Logo" />
          <img src={logo1} class="logo1" alt="System logo" />
        </div>
        <h1 className="system-name typing-effect">
  Welcome to <span className="system-name-main">Exam Engine</span>
</h1>

      </div>
    </div>
  );
}

export default LandingPage;
