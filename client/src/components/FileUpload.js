import React, { useState } from "react";
import axios from "axios";
import "../App.css";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const allowedTypes = ["image/jpeg", "image/png", "application/pdf", 
                        "application/vnd.ms-excel", 
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
      setMessage("");
      setMessageType("");
    } else {
      setFile(null);
      setMessage("Only image, Excel, and PDF files are allowed.");
      setMessageType("error"); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          setMessage(response.data.message);
          setMessageType("success");
        }
      } catch (error) {
        setMessage(error.response ? error.response.data.message : "File upload failed. Please check the server.");
        setMessageType("error"); 
      }
    } else {
      setMessage("Please select a file first.");
      setMessageType("error"); 
    }
  };

  return (
    <div className="containerStyle">
      <h1>Upload File Image,Pdf or Excel File</h1>
      <form onSubmit={handleSubmit} className="formStyle">
        <input type="file" onChange={handleFileChange} accept=".jpeg, .png, .pdf, .xls, .xlsx" />
        <button type="submit">Upload</button>
      </form>
      {message && <p className={messageType === "success" ? "successMessage" : "errorMessage"}>{message}</p>}
    </div>
  );
};

export default FileUpload;
