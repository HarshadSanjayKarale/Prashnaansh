import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "./logs.css";

export function LoginLogs() {
  const navigate = useNavigate(); // Add this hook
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all', // all, success, error
    activity: 'all', // all, login, generate
  });

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://web-production-a502.up.railway.app//api/logs');
      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await response.json();
      
      const lastSuccessfulLogin = data.data.find(
        log => log.endpoint === '/api/login' && log.response_status === 200
      );
      if (lastSuccessfulLogin) {
        setCurrentUser(lastSuccessfulLogin.request_data.username);
      }
      
      setLogs(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // If no token exists, just clear storage and redirect
        localStorage.clear();
        sessionStorage.clear();
        setIsOpen(false);
        navigate('/');
        return;
      }
  
      const response = await fetch('https://web-production-a502.up.railway.app/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Clear storage regardless of response
      localStorage.clear();
      sessionStorage.clear();
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      setIsOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // Still clear storage and redirect even if there's an error
      localStorage.clear();
      sessionStorage.clear();
      setIsOpen(false);
      navigate('/');
    }
  };

  const getActivityMessage = (log) => {
    const isSuccess = log.response_status === 200;
    
    if (log.endpoint === '/api/login') {
      return isSuccess 
        ? 'Logged in successfully'
        : `Login failed: ${log.error || 'Unknown error'}`;
    }
    
    if (log.endpoint === '/generate') {
      if (isSuccess) {
        const { filename, set_number } = log.request_data;
        return `Generated Question Paper Successfully for ${filename} (Set ${set_number})`;
      }
      return `Question paper generation failed: ${log.error || 'Unknown error'}`;
    }
    
    return log.error || 'Unknown activity';
  };

  const filteredLogs = logs.filter((log) => {
    const activityMessage = getActivityMessage(log);
    const username = log.endpoint === '/generate' ? currentUser : log.request_data?.username;
    const isSuccess = log.response_status === 200;

    // Search query filter
    const searchTerms = searchQuery.toLowerCase();
    const matchesSearch = 
      username?.toLowerCase().includes(searchTerms) ||
      log.ip_address?.toLowerCase().includes(searchTerms) ||
      activityMessage.toLowerCase().includes(searchTerms) ||
      (log.request_data?.filename || '').toLowerCase().includes(searchTerms);

    // Status filter
    const matchesStatus = 
      filters.status === 'all' ||
      (filters.status === 'success' && isSuccess) ||
      (filters.status === 'error' && !isSuccess);

    // Activity type filter
    const matchesActivity = 
      filters.activity === 'all' ||
      (filters.activity === 'login' && log.endpoint === '/api/login') ||
      (filters.activity === 'generate' && log.endpoint === '/generate');

    return matchesSearch && matchesStatus && matchesActivity;
  });

  return (
    <>
      <button className="logs-button" onClick={() => setIsOpen(true)}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 3v5h5" />
          <path d="M3 3l6.1 6.1" />
          <path d="M21 21v-5h-5" />
          <path d="M21 21l-6.1-6.1" />
          <path d="M3 21v-5h5" />
          <path d="M3 21l6.1-6.1" />
          <path d="M21 3v5h-5" />
          <path d="M21 3l-6.1 6.1" />
        </svg>
      </button>

      {isOpen && (
        <div className="logs-overlay" onClick={() => setIsOpen(false)}>
          <div className="logs-container" onClick={(e) => e.stopPropagation()}>
            <div className="logs-header">
              <div className="logs-header-content">
                <div className="logs-title">
                  <h2>Activity Logs</h2>
                  <p>View your recent activities</p>
                </div>
                <button 
                  className="logout-button" 
                  onClick={handleLogout}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <div className="logs-content">
              <div className="logs-filters">
                <div className="logs-search">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by username, activity, or filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filters-row">
                  <select 
                    value={filters.status} 
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                  <select 
                    value={filters.activity} 
                    onChange={(e) => setFilters(prev => ({ ...prev, activity: e.target.value }))}
                    className="filter-select"
                  >
                    <option value="all">All Activities</option>
                    <option value="login">Login</option>
                    <option value="generate">Question Paper</option>
                  </select>
                </div>
              </div>

              <div className="logs-list">
                {isLoading ? (
                  <div className="logs-loading">Loading logs...</div>
                ) : error ? (
                  <div className="logs-error">{error}</div>
                ) : filteredLogs.length === 0 ? (
                  <div className="logs-empty">No matching activities found</div>
                ) : (
                  filteredLogs.map((log) => {
                    const date = new Date(log.timestamp.$date);
                    const formattedDate = date.toLocaleString();
                    const isSuccess = log.response_status === 200;
                    const username = log.endpoint === '/generate' ? currentUser : log.request_data?.username;

                    return (
                      <div key={log._id.$oid} className="log-item">
                        <div className="log-item-header">
                          {isSuccess ? (
                            <svg
                              className="success-icon"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="m9 12 2 2 4-4" />
                            </svg>
                          ) : (
                            <svg
                              className="error-icon"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="m15 9-6 6" />
                              <path d="m9 9 6 6" />
                            </svg>
                          )}
                          <span className="log-item-username">
                            {username}
                          </span>
                        </div>
                        <div className="log-item-date">{formattedDate}
                        <div className="log-item-detail">
                            <span>IP Address: </span>
                            {log.ip_address}
                        </div>
                        </div>
                        <div className="log-item-details">
                          <div className={`log-item-activity ${isSuccess ? 'success' : 'error'}`}>
                            {getActivityMessage(log)}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}