import React from "react";
import { useState } from "react";
import FileUpload from "../FileUpload";
import HomePosts from "../HomePosts";
import { ToastContainer } from "react-toastify";
import "../Home1.css";
const Resumes = () => {
  const [parsedJson, setParsedJson] = useState(null);
  const [resumeSaved, setResumeSaved] = useState(false);

  const deleteParsedJson = () => {
    setParsedJson(null);
    setResumeSaved(false);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <FileUpload
          onParsedJson={setParsedJson}
          deleteParsedJson={deleteParsedJson}
          setResumeSaved={setResumeSaved}
        />
      </div>

      {parsedJson && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">Parsed PDF Content</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(parsedJson, null, 2)}
          </pre>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-4">Candidate List</h2>
        <HomePosts resumeSaved={resumeSaved} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Resumes;
