import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./MainPage.css";
import logo from "./assets/logo.png";

const API_URL = 'http://localhost:8000';

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
  const [lastGeneratedData, setLastGeneratedData] = useState(null);

  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        setWorkbook(wb);
        
        const sheets = wb.SheetNames;
        setSheetNames(sheets);
        
        if (sheets.length > 0) {
          setCurrentSheet(sheets[0]);
          loadSheetData(wb, sheets[0]);
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        alert("Error reading the Excel file. Please make sure it's a valid Excel document.");
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
      setPreviewData({ headers, rows });
    } else {
      setPreviewData({ headers: [], rows: [] });
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
    if (selectedFile && 
        (selectedFile.name.endsWith(".xlsx") || 
         selectedFile.name.endsWith(".xls"))) {
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

  const downloadFile = async (response) => {
    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
      : `QuestionPaper_Set${selectedSet}.docx`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleSendToBackend = async () => {
    if (!file || !selectedSet) {
      alert("Please upload a file and select a set first");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('excel_file', file);
      formData.append('word_file', `QuestionPaper_Set${selectedSet}`);
      formData.append('set_number', selectedSet); // Set I, Set II, Set III

      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate question paper');
      }

      setLastGeneratedData({ file, selectedSet });
      setIsGenerated(true);
    } catch (error) {
      console.error('Error generating question paper:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadQuestionPaper = async () => {
    if (!lastGeneratedData) {
      alert('Please generate a question paper first');
      return;
    }

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('excel_file', lastGeneratedData.file);
      formData.append('word_file', `QuestionPaper_Set${lastGeneratedData.selectedSet}`);

      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to download question paper');
      }

      await downloadFile(response);
    } catch (error) {
      console.error('Error downloading question paper:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
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

      <div className="upload-card">
        <h2 className="card-title">Upload Excel File</h2>
        <p className="card-description">
          Upload your Excel file (.xlsx or .xls) to generate question papers
        </p>

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

        <select
          className="set-select"
          value={selectedSet}
          onChange={(e) => setSelectedSet(e.target.value)}
        >
          <option value="">Select Set</option>
          <option value="I">Set I</option>
          <option value="II">Set II</option>
          <option value="III">Set III</option>
        </select>

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
                onClick={handleDownloadQuestionPaper}
                disabled={isProcessing}
              >
                Question Paper
              </button>
              <button
                className="button secondary-button"
                disabled={true}
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