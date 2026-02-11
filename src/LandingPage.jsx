// LandingPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "./assets/logo.png";
import logo1 from "./assets/PRASHNAANSH.png";


function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add class to body and html to prevent scrolling on landing page
    document.body.classList.add('landing-page-active');
    document.documentElement.classList.add('landing-page-active');

    // Cleanup function to remove classes when component unmounts
    return () => {
      document.body.classList.remove('landing-page-active');
      document.documentElement.classList.remove('landing-page-active');
    };
  }, []);

  const enableFullScreen = async () => {
    const elem = document.documentElement;
    
    try {
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        await elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Error enabling fullscreen:', error);
    }
  };

  const isFullScreen = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  };

  const handleNavigation = async (event) => {
    // Prevent default for keypress events
    if (event) {
      event.preventDefault();
    }

    try {
      if (!isFullScreen()) {
        await enableFullScreen();
      }
      navigate("/login");
    } catch (error) {
      console.error('Error during navigation:', error);
      navigate("/login");
    }
  };

  // Handle key press events
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleNavigation(event);
    }
  };

  useEffect(() => {
    // Add keypress listener to document
    document.addEventListener('keypress', handleKeyPress);

    // Handle fullscreen changes
    const handleFullscreenChange = async () => {
      if (!isFullScreen()) {
        try {
          await enableFullScreen();
        } catch (err) {
          console.error('Error re-enabling fullscreen:', err);
        }
      }
    };

    // Add fullscreen change listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Cleanup function
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className="landing-page"
      onClick={() => handleNavigation()}
      tabIndex={0}
    >
      <div className="content">
        <div className="logo-container">
          <img
            src={logo}
            className="logo"
            alt="College Logo"
            draggable="false"
          />
          <img
            src={logo1}
            className="logo1"
            alt="System Logo"
            draggable="false"
          />
        </div>
        <h3 className="system-name typing-effect">
          Welcome to <span className="system-name-main">PRASHNAANSH</span>
        </h3>
      </div>
    </div>
  );
}

export default LandingPage;