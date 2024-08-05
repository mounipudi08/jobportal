// import React, { useState, useCallback, useEffect } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "../interview.css";
 
// const Interviews = ({ email }) => {
//   const [interviews, setInterviews] = useState([]);
//   const token = localStorage.getItem("token");
 
//   const fetchInterviews = useCallback(async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/getInterviews/${email}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       ); 
//       setInterviews(response.data);
//     } catch (error) {
//       toast.error("Error fetching interviewers");
//     }
//   }, [token, email]);
 
//   useEffect(() => {
//     fetchInterviews();
//   }, [fetchInterviews]);
 
//   const handleFeedbackChange = (event, interview) => {
//     const { name, value } = event.target;
//     setInterviews((prevInterviews) =>
//       prevInterviews.map((previousInterview) =>
//         previousInterview.id === interview.id
//           ? {
//               ...previousInterview,
//               [name]: value,
//             }
//           : previousInterview
//       )
//     );
//   };
 
//   const handleSubmitFeedback = async (e, profile, interview) => {
//     e.preventDefault();
//     try {
//       const feedbackData = {
//         id: interview.id,
//         interviewer: interview.interviewer,
//         profile,
//         feedback: interview.feedback,
//         rating: interview.rating,
//         completed: interview.completed,
//       };
 
//       // Make PUT request to submit feedback
//       await axios.put("http://localhost:8081/saveFeedback", feedbackData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
 
//       // Notify user of successful submission
//       toast.success("Feedback submitted successfully!");
//     } catch (error) {
//       // Log error for debugging
//       console.error("Error submitting feedback:", error);
//       if (error.response) {
//         console.error("Server responded with:", error.response.data);
//       }
//       // Notify user of submission failure
//       // console.error("error",error);
//       toast.error("Feedback could not be submitted");
//     }
//   };
 
//   return (
//     <div className = "container mx-auto p-4">
//       <div>
//         <h2 >
//           Scheduled Candidates
//         </h2>
//         {interviews.length === 0 ? (
//           <p>No candidates scheduled.</p>
//         ) : (
//           <div >
//             <table >
//               <thead >
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Phone</th>
//                   <th>Skills</th>
//                   <th>Designation</th>
//                   <th>Interview Completion</th>
//                   <th>Feedback</th>
//                   <th>Rating</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {interviews.map((interview) => (
//                   <tr key={interview.id}>
//                     <td>{interview.profile.name}</td>
//                     <td>{interview.profile.contact.email}</td>
//                     <td>{interview.profile.contact.phone}</td>
//                     <td>
//                       {interview.profile.skills.primary}{" "}
//                       {interview.profile.skills.secondary.join(", ")}
//                     </td>
//                     <td>{interview.profile.title}</td>
//                     <td>
//                       <select
//                         value={interview.completed}
//                         name="completed"
//                         onChange={(e) => handleFeedbackChange(e, interview)}
//                       >
//                         <option value={false}>Select</option>
//                         <option value={true}>Yes</option>
//                         <option value={false}>No</option>
//                       </select>
//                     </td>
//                     {/* don't show if it's no  */}
//                     {String(interview.completed) === "true" && (
//                       <>
//                         <td>
//                           <textarea
//                             name="feedback"
//                             placeholder="Enter your feedback here..."
//                             value={interview.feedback}
//                             onChange={(e) => handleFeedbackChange(e, interview)}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="number"
//                             name="rating"
//                             min="1"
//                             max="5"
//                             placeholder="Rating (1-5)"
//                             value={interview.rating}
//                             onChange={(e) => handleFeedbackChange(e, interview)}
//                           />
//                         </td>
//                         <td>
//                           <button
//                             className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
//                             onClick={(e) =>
//                               handleSubmitFeedback(
//                                 e,
//                                 interview.profile,
//                                 interview
//                               )
//                             }
//                           >
//                             Submit Feedback & Rating
//                           </button>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };
 
// export default Interviews;
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../interview.css";

const Interviews = ({ email }) => {
  const [interviews, setInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchInterviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/getInterviews/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedInterviews = response.data;
      const completed = fetchedInterviews.filter(
        (interview) => interview.completed
      );
      const incomplete = fetchedInterviews.filter(
        (interview) => !interview.completed
      );
      setCompletedInterviews(completed);
      setInterviews(incomplete);
    } catch (error) {
      toast.error("Error fetching interviewers");
    }
  }, [token, email]);

  useEffect(() => {
    fetchInterviews();
    const savedCompletedInterviews = JSON.parse(
      localStorage.getItem("completedInterviews")
    );
    if (savedCompletedInterviews) {
      setCompletedInterviews(savedCompletedInterviews);
    }
  }, [fetchInterviews]);

  useEffect(() => {
    localStorage.setItem(
      "completedInterviews",
      JSON.stringify(completedInterviews)
    );
  }, [completedInterviews]);

  const handleFeedbackChange = (event, interview) => {
    const { name, value } = event.target;
    setInterviews((prevInterviews) =>
      prevInterviews.map((previousInterview) =>
        previousInterview.id === interview.id
          ? {
              ...previousInterview,
              [name]: value,
            }
          : previousInterview
      )
    );
  };

  const handleSubmitFeedback = async (e, profile, interview) => {
    e.preventDefault();
    try {
      const feedbackData = {
        id: interview.id,
        interviewer: interview.interviewer,
        profile,
        feedback: interview.feedback,
        rating: interview.rating,
        completed: interview.completed,
      };

      // Make PUT request to submit feedback
      await axios.put("http://localhost:8081/saveFeedback", feedbackData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Notify user of successful submission
      toast.success("Feedback submitted successfully!");

      // Move the submitted interview to the completedInterviews state
      setCompletedInterviews((prevCompleted) => [...prevCompleted, interview]);

      // Remove the submitted interview from the interviews state
      setInterviews((prevInterviews) =>
        prevInterviews.filter((i) => i.id !== interview.id)
      );
    } catch (error) {
      // Log error for debugging
      console.error("Error submitting feedback:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
      // Notify user of submission failure
      toast.error("Feedback could not be submitted");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <h2>Scheduled Candidates</h2>
        {interviews.length === 0 && completedInterviews.length === 0 ? (
          <p>No candidates scheduled.</p>
        ) : (
          <div>
            {interviews.length > 0 && (
              <>
                {/* <h3>Incomplete Interviews</h3> */}
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Skills</th>
                      <th>Designation</th>
                      <th>Interview Completion</th>
                      <th>Feedback</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((interview) => (
                      <tr key={interview.id}>
                        <td>{interview.profile.name}</td>
                        <td>{interview.profile.contact.email}</td>
                        <td>{interview.profile.contact.phone}</td>
                        <td>
                          {interview.profile.skills.primary}{" "}
                          {interview.profile.skills.secondary.join(", ")}
                        </td>
                        <td>{interview.profile.title}</td>
                        <td>
                          <select
                            value={interview.completed}
                            name="completed"
                            onChange={(e) => handleFeedbackChange(e, interview)}
                          >
                            <option value={false}>Select</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </td>
                        {String(interview.completed) === "true" && (
                          <>
                            <td>
                              <textarea
                                name="feedback"
                                placeholder="Enter your feedback here..."
                                value={interview.feedback}
                                onChange={(e) =>
                                  handleFeedbackChange(e, interview)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                name="rating"
                                min="1"
                                max="5"
                                placeholder="Rating (1-5)"
                                value={interview.rating}
                                onChange={(e) =>
                                  handleFeedbackChange(e, interview)
                                }
                              />
                            </td>
                            <td>
                              <button
                                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                                onClick={(e) =>
                                  handleSubmitFeedback(
                                    e,
                                    interview.profile,
                                    interview
                                  )
                                }
                              >
                                Submit Feedback & Rating
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {completedInterviews.length > 0 && (
              <>
                <h2>Completed Interviews</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Skills</th>
                      <th>Designation</th>
                      <th>Interview Completion</th>
                      <th>Feedback</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td>{interview.profile.name}</td>
                        <td>{interview.profile.contact.email}</td>
                        <td>{interview.profile.contact.phone}</td>
                        <td>
                          {interview.profile.skills.primary}{" "}
                          {interview.profile.skills.secondary.join(", ")}
                        </td>
                        <td>{interview.profile.title}</td>
                        <td>{String(interview.completed)}</td>
                        <td>{interview.feedback}</td>
                        <td>{interview.rating}</td>
                        <td>Feedback Completed</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Interviews;