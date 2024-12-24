// ExcelUpload.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./MainPage.css";
import logo from "./assets/logo.png";

const MainPage = () => {
  const [file, setFile] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [currentSheet, setCurrentSheet] = useState("");
  const [previewData, setPreviewData] = useState({
    headers: [],
    rows: [],
  });
  const [selectedSet, setSelectedSet] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb);

        // Get all sheet names
        const sheets = wb.SheetNames;
        setSheetNames(sheets);

        // Set first sheet as default and load its data
        if (sheets.length > 0) {
          setCurrentSheet(sheets[0]);
          loadSheetData(wb, sheets[0]);
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert(
          "Error reading the Excel file. Please make sure it's a valid Excel document."
        );
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      alert("Error reading the file. Please try again.");
    };

    reader.readAsArrayBuffer(file);
  };

  const loadSheetData = (wb, sheetName) => {
    const sheet = wb.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length > 0) {
      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      setPreviewData({
        headers,
        rows,
      });
    } else {
      setPreviewData({
        headers: [],
        rows: [],
      });
      alert("The selected sheet appears to be empty");
    }
  };

  const handleSheetChange = (e) => {
    const selectedSheet = e.target.value;
    setCurrentSheet(selectedSheet);
    if (workbook) {
      loadSheetData(workbook, selectedSheet);
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (
      selectedFile &&
      (selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls"))
    ) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    } else {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSendToBackend = () => {
    if (!file || !selectedSet) {
      alert("Please upload a file and select a set first");
      return;
    }

    setIsProcessing(true);
    // Simulate backend processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsGenerated(true);
    }, 2000);
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="college-logo" className="logo" />
        <div className="header-content">
          <h1 className="title">
            PIMPRI CHINCHWAD EDUCATION TRUST's
            <br />
            PIMPRI CHINCHWAD COLLEGE OF ENGINEERING
          </h1>
          <p className="subtitle">
            NBA Accredited | NAAC Accredited with 'A' Grade | An Autonomous
            Institute | AICTE Approved | ISO 21001:2018 Certified | Permanently
            Affiliated to SPPU, Pune
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="upload-card">
        <h2 className="card-title">Upload Excel File</h2>
        <p className="card-description">
          Upload your Excel file (.xlsx or .xls) to generate question papers
        </p>

        {/* File Upload */}
        <div
          className={`drop-zone ${isDragActive ? "active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label>
            <input
              type="file"
              className="file-input"
              accept=".xlsx,.xls"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
            <div className="upload-text">
              <div className="upload-icon">📄</div>
              Drag and drop your Excel file here, or click to browse
            </div>
          </label>
          {file && (
            <div className="selected-file">Selected file: {file.name}</div>
          )}
        </div>

        {/* Sheet Selector */}
        {sheetNames.length > 0 && (
          <div className="sheet-selector">
            <label htmlFor="sheet-select">Select Sheet: </label>
            <select
              id="sheet-select"
              value={currentSheet}
              onChange={handleSheetChange}
              className="sheet-select"
            >
              {sheetNames.map((sheet) => (
                <option key={sheet} value={sheet}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Preview */}
        {previewData.headers.length > 0 && (
          <div className="table-container">
            <table className="preview-table">
              <thead>
                <tr>
                  {previewData.headers.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {previewData.headers.map((_, colIndex) => (
                      <td key={colIndex}>
                        {row[colIndex] !== undefined ? row[colIndex] : ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Set Selection */}
        <select
          className="set-select"
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
        >
          <option value="">Select Set</option>
          <option value="A">Set I</option>
          <option value="B">Set II</option>
          <option value="C">Set III</option>
        </select>

        {/* Action Buttons */}
        <div className="button-group">
          <button
            className="button primary-button"
            onClick={handleSendToBackend}
            disabled={!file || !selectedSet || isProcessing}
          >
            {isProcessing ? "Processing..." : "Generate Question Paper"}
          </button>

          {isGenerated && (
            <>
              <button
                className="button secondary-button"
                onClick={() => console.log("Download Primary")}
              >
                Question Paper
              </button>
              <button
                className="button secondary-button"
                onClick={() => console.log("Download Master")}
              >
                Master Question Paper
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
