import React, { useState } from "react";
import "./logs.css";

export function LoginLogs() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with your actual data
  const logs = [
    {
      _id: "678b36e0dfc475b32e40b56e",
      timestamp: "2025-01-18T05:06:40.222+00:00",
      endpoint: "/api/login",
      method: "POST",
      ip_address: "127.0.0.1",
      user_agent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      request_data: {
        username: "PccoeExam",
      },
      response_status: 200,
      error: null,
    },
  ];

  const filteredLogs = logs.filter(
    (log) =>
      log.request_data.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      log.ip_address.includes(searchQuery)
  );

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
              <h2>Login Activity Logs</h2>
              <p>View recent login attempts and their status</p>
            </div>

            <div className="logs-content">
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
                  placeholder="Search by username or IP address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="logs-list">
                {filteredLogs.map((log) => {
                  const date = new Date(log.timestamp);
                  const formattedDate = date.toLocaleString();
                  const isSuccess = log.response_status === 200;

                  return (
                    <div key={log._id} className="log-item">
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
                          {log.request_data.username}
                        </span>
                      </div>
                      <div className="log-item-date">{formattedDate}</div>
                      <div className="log-item-details">
                        <div className="log-item-detail">
                          <span>IP Address: </span>
                          {log.ip_address}
                        </div>
                        <div className="log-item-detail">
                          <span>Method: </span>
                          {log.method}
                        </div>
                        <div className="log-item-detail">
                          <span>Endpoint: </span>
                          {log.endpoint}
                        </div>
                        <div className="log-item-detail">
                          <span>Status: </span>
                          {log.response_status}
                        </div>
                      </div>
                      {log.error && (
                        <div className="log-item-error">{log.error}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
