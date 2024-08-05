import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import "./FileUpload.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 
// eslint-disable-next-line react/prop-types
const FileUpload = ({ onParsedJson, deleteParsedJson, setResumeSaved }) => {
  const [files, setFiles] = useState([]);
  const [json, setJson] = useState([]);
 
  const token = localStorage.getItem("token");
 
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
 
      const uploadFile = acceptedFiles[0];
 
      try {
        const formData = new FormData();
        formData.append("file", uploadFile);
 
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
 
        onParsedJson(response.data);
        setJson([...json, response.data]);
        console.log("Resume uploaded and parsed successfully:", response.data);
      } catch (error) {
        console.error("Error uploading and parsing resume:", error);
      }
 
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFiles([...files, ...newFiles]);
    },
    [files, onParsedJson, json]
  );
 
  const handleDelete = (index) => {
    if (index === files.length - 1) {
      deleteParsedJson();
    }
    const updatedFiles = [...files];
    const updatedJson = [...json];
    updatedFiles.splice(index, 1);
    updatedJson.splice(index, 1);
    setFiles(updatedFiles);
    setJson(updatedJson);
  };
 
  const handleSubmit = async (index) => {
    try {
      const jsonRequest = json[index];
      const response = await axios.post(
        "http://localhost:8081/saveProfiles",
        jsonRequest,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data) {
        toast.success("Resume saved successfully!");
        handleDelete(index);
        setResumeSaved(true);
      } else {
        toast.error("Resume could not be saved!");
      }
    } catch (error) {
      console.error("Error saving resume in the database:", error);
      toast.error("Resume could not be saved!");
    }
  };
 
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
 
  return (
    <Container className="mt-5"/*"upload-container"/*"/*px-20 py-6"*/>
      <Row className="justify-content-center">
        <Col md={8}>
      <Card className="text-center shadow p-4 mb-4">
        {/* "upload-title""text-2xl font-bold text-center mb-6" */}
      <Card.Title>
        Upload your resume:
        </Card.Title>
        <Card.Body
        {...getRootProps({
          className:"upload-area"
            // "border-dashed border-2 border-blue-500 rounded-lg p-8 text-center cursor-pointer bg-blue-50",
        })}
      >
        <input {...getInputProps()} />
        <div className="upload-content"/*"flex flex-col items-center justify-center"*/>
          <FaCloudUploadAlt className="text-blue-500 text-5xl mb-4" />
          <p className="upload-text"/*"text-gray-600 text-lg"*/>
           <Card.Text> Drag & drop files here, or click to select files</Card.Text>
          </p>
        </div>
      </Card.Body>
      </Card>
 
      {files.length > 0 && (
        <div className="file-preview-container"/*"mt-4"*/>
          <h3 className="text-center mb-4">UploadedFiles</h3>
          {/* "files-title""text-xl font-bold mb-2" */}
 
          {files.map((file, index) => (
            <Card key={index} className="file-preview mb-3"/*"bg-white p-4 rounded-lg shadow-md mt-2"*/>
              <Card.Body className="text-center">
              {file.file.type === "application/pdf" ? (
                <embed
                    src={file.preview}
                    type="application/pdf"
                    width="200"
                    height="100"
                    className="mb-2" /*"mx-auto"*/
                  />
                  // <p className="file-name"/*"text-x2 font-bold mb-2"*/>{file.file.path}</p>
               
              ) : (
                <p className="file-name">{file.file.path}</p>
              )}
              <br />
              <Button
               variant="danger"
                onClick={() => handleDelete(index)}
                  className="mr-2 delete-btn"/*"bg-red-500 text-white font-bold py-2 px-4 rounded mt-2"*/
                 style = {{backgroundColor: 'red'}}
              >
                Delete
              </Button>
 
              <Button
               variant="success"
                onClick={() => handleSubmit(index)}
                className="submit-btn"/*"bg-green-500 text-white font-bold py-2 px-4 rounded mt-2 ml-2"*/
              >
                Submit
              </Button>
            </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Col>
    </Row>
    </Container>
  );
};
 
export default FileUpload;
 