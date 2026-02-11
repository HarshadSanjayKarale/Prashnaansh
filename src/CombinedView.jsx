// CombinedView.jsx
import React from 'react';
import { LoginLogs } from './login-logs';
import StudentList from './StudentsList';
import './combined-view.css';

export default function CombinedView() {
  return (
    <div className="combined-container">
      <div className="button-bottom">
        <LoginLogs />
      </div>
    </div>
  );
}