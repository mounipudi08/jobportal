
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./HomePosts.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePosts = ({ resumeSaved }) => {
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [showInterviewers, setShowInterviewers] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [editingCandidate, setEditingCandidate] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/profiles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData, resumeSaved]);

  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this candidate?")) {
        await axios.delete(`http://localhost:8081/deleteProfile/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchData();
        toast.success("Candidate deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Candidate could not be deleted");
    }
  };

  const handleSchedule = async (candidate) => {
    try {
      if (window.confirm("Are you sure you want to schedule this candidate?")) {
        const response = await axios.get("http://localhost:8081/interviewers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentCandidate(candidate);
        setInterviewers(response.data);
        setShowInterviewers(true);
      }
    } catch (error) {
      console.error("Error getting interviewers list:", error);
    }
  };

  const handleScheduleCandidate = async (candidate, interviewer) => {
    try {
      if (
        window.confirm(
          `Are you sure you want to schedule ${candidate.name} with ${interviewer.name}?`
        )
      ) {
        await axios.post(
          "http://localhost:8081/saveInterview",
          { interviewer: interviewer, profile: candidate },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Candidate scheduled successfully!");
        setShowInterviewers(false);
      }
    } catch (error) {
      console.error("Error scheduling candidate:", error);
      toast.error("Candidate could not be scheduled");
    }
  };

  const handleFeedBack = async (candidate) => {
    try {
      if (
        window.confirm(
          `Are you sure you want to see the feedback for ${candidate.name}?`
        )
      ) {
        const response = await axios.get(
          `http://localhost:8081/getFeedback/${candidate.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedbackData(response.data);
        setCurrentCandidate(candidate);
        setShowFeedback(true);
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  const handleChange = (e, candidate) => {
    const { name, value } = e.target;
    setCandidates((prevCandidates) =>
      prevCandidates.map((previous) =>
        previous.id === candidate.id ? { ...previous, [name]: value } : previous
      )
    );
    setEditingCandidate({ ...editingCandidate, [candidate.id]: true });
  };

  const handleSubmit = async (candidate) => {
    try {
      await axios.put(
        `http://localhost:8081/updateProfile/${candidate.id}`,
        candidate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingCandidate({ ...editingCandidate, [candidate.id]: false });
      fetchData();
      toast.success("Availability changed successfully!");
    } catch (error) {
      console.error("Error updating candidate:", error);
      toast.error("Availability could not be changed");
    }
  };

  const handleDropdownChange = (e, candidate) => {
    const action = e.target.value;
    switch (action) {
      case "submitAvailability":
        handleSubmit(candidate);
        break;
      case "delete":
        handleDelete(candidate.id);
        break;
      case "interviewers":
        handleSchedule(candidate);
        break;
      case "feedback":
        handleFeedBack(candidate);
        break;
      default:
        break;
    }
    e.target.value = "";
  };

  const handleCancel = () => {
    setShowInterviewers(false);
    setShowFeedback(false);
    setDropdownOpen(null);
  };

  return (
    <div>
      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-lg text-gray-600">No resumes uploaded yet.</p>
        ) : (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Sq. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                  <th>Designation</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.toReversed().map((candidate, index) => (
                  <tr key={candidate.id} style={{ position: "relative" }}>
                    <td>{index + 1}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.contact.email}</td>
                    <td>{candidate.contact.phone}</td>
                    <td>
                      {candidate.skills.primary}{" "}
                      {candidate.skills.secondary.map(
                        (skill, i) => (i > 0 ? ", " : "") + skill
                      )}
                    </td>
                    <td>{candidate.title}</td>
                    <td>
                      <select
                        value={candidate.availability}
                        name="availability"
                        onChange={(e) => handleChange(e, candidate)}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </td>
                    <td>
                      <select
                        onChange={(e) => handleDropdownChange(e, candidate)}
                        className="dropdown-select"
                      >
                        <option value="">
                         Select
                        </option>
                        <option value="submitAvailability">
                          Submit Availability
                        </option>
                        <option value="delete">Delete</option>
                        <option value="interviewers">Interviewers List</option>
                        <option value="feedback">Feedback</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showInterviewers && (
          <div
            className="modal"
            style={{ display: showInterviewers ? "flex" : "none" }}
          >
            <div className="modal-content">
              <span className="close" onClick={handleCancel}>
                &times;
              </span>
              <h1 style={{ textAlign: "center" }}>Interviewers</h1>
              <ul className="modal-list">
                {interviewers.map((interviewer) => (
                  <li key={interviewer.id}>
                    <span>{interviewer.email}</span>
                    <button
                      className="hover:bg-green-700 bg-green-500 ml-4"
                      onClick={() =>
                        handleScheduleCandidate(currentCandidate, interviewer)
                      }
                    >
                      Schedule
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {showFeedback && feedbackData && (
          <div
            className="modal"
            style={{ display: showFeedback ? "flex" : "none" }}
          >
            <div className="modal-content">
              <span className="close" onClick={handleCancel}>
                &times;
              </span>
              <h1 style={{ textAlign: "center" }}>Feedback</h1>
              {feedbackData.length === 0 ? (
                <p>No feedback available for this candidate.</p>
              ) : (
                <ul className="modal-list">
                  {feedbackData.map((feedback, index) => (
                    <li key={index}>
                      <div>
                        <p>
                          <strong>Interviewer:</strong>{" "}
                          {feedback.interviewer.email}
                        </p>
                        {feedback.completed ? (
                          <div>
                            <p>
                              <strong>Feedback:</strong>{" "}
                              {feedback.feedback || "No feedback provided"}
                            </p>
                            <p>
                              <strong>Rating:</strong>{" "}
                              {feedback.rating || "No rating"}
                            </p>
                          </div>
                        ) : (
                          <p>The interview is not yet complete.</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePosts;

 
          
  