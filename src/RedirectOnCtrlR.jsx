import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectOnCtrlR() {
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle keydown event
    const handleKeyDown = (e) => {
      // Check if Ctrl or Cmd + R keys are pressed
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault(); // Prevent the default refresh behavior
        navigate("/"); // Redirect to the homepage
      }
    };

    // Add event listener for keydown event
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default RedirectOnCtrlR;
