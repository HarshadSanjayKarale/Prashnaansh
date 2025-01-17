// SecurityWrapper.jsx
import React, { useEffect } from 'react';

function SecurityWrapper({ children }) {
  const preventScreenCapture = () => {
    // Prevent screen capture using Page Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        console.log('Application minimized or switched tabs');
      }
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // Disable print screen and other capture methods
    document.addEventListener('keydown', (e) => {
      const forbiddenKeys = [
        'PrintScreen',
        'F12',
        'I',
        'i',
        'J',
        'j',
        'S',
        's',
        'C',
        'c',
        'K',
        'k'
      ];

      if (
        forbiddenKeys.includes(e.key) && (e.ctrlKey || e.metaKey) ||
        (e.key === 'F12') ||
        (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j'].includes(e.key)) ||
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && ['p', 'P'].includes(e.key))
      ) {
        e.preventDefault();
        return false;
      }
    });

    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-touch-callout: none;
        pointer-events: auto;
      }
      
      img {
        pointer-events: none;
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
      }
    `;
    document.head.appendChild(style);
  };

  useEffect(() => {
    preventScreenCapture();
  }, []);

  return <>{children}</>;
}

export default SecurityWrapper;