import React from 'react'
import { useLocation } from "react-router";
import "./Profile.css";

function Profile() {
    const location = useLocation();
    const name = location.state.data.name;
    const email = location.state.data.email;
    console.log(name);
    console.log(email);
  return (
    <div className= "co">
      <ul>
        <li>
          <h1>Name: {name}</h1>
          <h1>EmailId: {email} </h1>
        </li>
      </ul>
    </div>
  );
}

export default Profile
