import React, { useState } from 'react';
import './student-list.css';
import Nayan from './assets/Nayan.jpg';
import Aviraj from './assets/Aviraj.png';
import Ashirwad from './assets/Ashirwad.jpg';
import Sujit from './assets/Sujit.jpg';
import Harshad from './assets/Harshad.jpg';
import teamaansh1 from './assets/Teamaansh1.jpeg';

export default function StudentList(){
  const [isOpen, setIsOpen] = useState(false);
  const [tncOpen, setTncOpen] = useState(false);

  // Updated student data
  const students = [
    { 
      id: 1, 
      name: "Harshad Sanjay Karale", 
      department: "Computer Engineering",
      college: "Pimpri Chinchwad College of Engineering,Pune",
      image:Harshad
    },
    { 
      id: 2, 
      name: "Sujit Sachin Shaha", 
      department: "Computer Engineering",
      college: "Pimpri Chinchwad College of Engineering,Pune",
      image:Sujit
    },
    { 
      id: 3, 
      name: "Aviraj Popat Kale", 
      department: "Computer Engineering",
      college: "Pimpri Chinchwad College of Engineering,Pune",
      image:Aviraj
    },
    { 
      id: 4, 
      name: "Nayan Gajanan Keote", 
      department: "Computer Engineering",
      college: "Pimpri Chinchwad College of Engineering,Pune",
      image:Nayan
    },
    { 
      id: 5, 
      name: "Ashirwad Rajeshwar Katkamwar", 
      department: "Computer Engineering",
      college: "Pimpri Chinchwad College of Engineering,Pune",
      image:Ashirwad
    }
  ];

  return (
    <>
      <button className="student-button" onClick={() => setIsOpen(true)}>
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
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </button>

      {isOpen && (
        <div className="student-overlay" onClick={() => setIsOpen(false)}>
          <div className="student-container" onClick={(e) => e.stopPropagation()}>
          <div className="student-header">
  <img 
    src={teamaansh1} 
    alt="Team AANSH" 
    style={{
      width: '100%',
      maxWidth: '500px',
      borderRadius: '10px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '10px auto',
      display: 'block',
    }} 
  />
</div>


            <div className="student-content">
              <div className="student-list">
                {students.map((student) => (
                  <div key={student.id} className="student-item">
                    <div className="student-item-header">
                      <div className="student-image">
                        <img src={student.image} alt={student.name} />
                      </div>
                      <div className="student-info">
                        <span className="student-name">{student.name}</span>
                        <span className="student-department">{student.department}</span>
                        <span className="student-department">{student.college}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="student-footer">
                <button className="tnc-link" onClick={() => setTncOpen(true)}>
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tncOpen && (
        <div className="tnc-overlay" onClick={() => setTncOpen(false)}>
          <div className="tnc-container" onClick={(e) => e.stopPropagation()}>
            <div className="tnc-header">
              <h3>Terms and Conditions</h3>
              <button className="close-button" onClick={() => setTncOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="tnc-content">
              <p>By using this system, you agree to:</p>
              <ul>
                <li>Maintain confidentiality of student information</li>
                <li>Use the system only for authorized purposes</li>
                <li>Report any security concerns immediately</li>
                <li>Comply with all applicable data protection regulations</li>
              </ul>
              <p>These terms are subject to change. Please review periodically.</p>
            </div>
            <div className="tnc-footer">
              <button className="accept-button" onClick={() => setTncOpen(false)}>
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}