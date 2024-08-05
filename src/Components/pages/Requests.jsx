import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../Home.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState(""); 
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }

    fetch("http://localhost:8081/signup-requests/pending", {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      })
      .catch((err) => console.log(err));

    const socket = new SockJS("http://localhost:8081/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({ Authorization: `Bearer ${token}` }, function (frame) {
      console.log("Connected to the WebSocket" + frame);
      stompClient.subscribe("/topic/admin", function (message) {
        alert(message.body);
        console.log(message.body);
        setRequests((prevRequests) => [
          ...prevRequests,
          { id: new Date().getTime(), username: message.body, role: "Pending" },
        ]);
      });
    });

    return () => {
      stompClient.disconnect();
    };
  }, [token]); 

  const handleApprove = (id) => {
    fetch(`http://localhost:8081/signup-requests/${id}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (response.ok) {
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id)
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDisapprove = (id) => {
    fetch(`http://localhost:8081/signup-requests/${id}/disapprove`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (response.ok) {
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== id)
          );
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
      <div className="signup-request-box">
        <h2>Signup Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id}>
              <span>
                {request.name} - {request.role}
              </span>
              <div className="button-container">
                <button
                  className="approve-button"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </button>
                <button
                  className="disapprove-button"
                  onClick={() => handleDisapprove(request.id)}
                >
                  Disapprove
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Requests;
