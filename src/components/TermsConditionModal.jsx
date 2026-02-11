import React from 'react';
import ReactDOM from 'react-dom';
import './TermsConditionModal.css';

export const TermsConditionModal = ({ isOpen, onClose, onAccept }) => {
    if (!isOpen) return null;

    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <div>
                            <h2 className="modal-title">Terms and Conditions</h2>
                            <p className="modal-subtitle">Please read carefully before proceeding</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-button" aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    <div className="terms-content">
                        <div className="term-section term-blue">
                            <div className="term-number">1</div>
                            <div className="term-text">
                                <h3>Question Paper Generation</h3>
                                <p>
                                    The question paper will be generated based on the parameters you have provided
                                    (subject, set number, and uploaded Excel file). Please ensure all information is
                                    accurate and complete before proceeding with the generation process.
                                </p>
                            </div>
                        </div>

                        <div className="term-section term-green">
                            <div className="term-number">2</div>
                            <div className="term-text">
                                <h3>Content Accuracy & Verification</h3>
                                <p>
                                    While we strive to provide accurate and relevant questions based on your input data,
                                    please thoroughly review the generated content before distributing to students.
                                    The generated questions should be verified by the concerned faculty member or subject
                                    expert for accuracy, relevance, and appropriateness.
                                </p>
                            </div>
                        </div>

                        <div className="term-section term-purple">
                            <div className="term-number">3</div>
                            <div className="term-text">
                                <h3>Usage Rights & Educational Purpose</h3>
                                <p>
                                    The generated question papers are strictly for educational and examination purposes
                                    within your institution. You are responsible for ensuring proper usage, secure
                                    distribution, and maintaining the confidentiality of examination content.
                                </p>
                            </div>
                        </div>

                        <div className="term-section term-orange">
                            <div className="term-number">4</div>
                            <div className="term-text">
                                <h3>Data Privacy & Security</h3>
                                <p>
                                    Your input data (Excel files and configuration) will be used solely for generating
                                    the question paper. We respect your privacy and do not store sensitive examination
                                    content permanently on our servers. All data is processed securely and deleted after
                                    the generation process is complete.
                                </p>
                            </div>
                        </div>

                        <div className="term-section term-red">
                            <div className="term-number">5</div>
                            <div className="term-text">
                                <h3>Limitation of Liability</h3>
                                <p>
                                    We provide this tool as-is without any guarantees of fitness for a particular purpose.
                                    We are not liable for any consequences, direct or indirect, arising from the use of
                                    generated question papers. Users must exercise their own professional judgment,
                                    verification, and quality control before using the generated content in actual
                                    examinations.
                                </p>
                            </div>
                        </div>

                        <div className="term-section term-yellow">
                            <div className="term-number">6</div>
                            <div className="term-text">
                                <h3>Technical Requirements</h3>
                                <p>
                                    Ensure that your Excel file follows the prescribed format and contains valid data.
                                    The system generates papers in DOCX format. Generated papers will be available for
                                    download immediately after processing. Please download and verify the papers promptly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <div className="footer-message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <p>By clicking "Accept & Generate", you agree to these terms</p>
                    </div>
                    <div className="footer-buttons">
                        <button onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={onAccept} className="btn-accept">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            Accept & Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};