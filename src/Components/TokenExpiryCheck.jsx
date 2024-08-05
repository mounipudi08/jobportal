import React, { useEffect } from "react";

const TokenExpiryCheck = ({ onTokenExpired }) => {
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return ;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split(".")[1])); 
        const currentTime = Date.now() / 1000; 

        if (tokenPayload && tokenPayload.exp < currentTime) {
          console.log("Token is expired");
          onTokenExpired(); 
        }
        else {
          console.log("pl", tokenPayload.exp);
          console.log("time", currentTime);
          
        }
      } catch (error) {
        console.error("Error decoding or parsing token:", error);
        // return true; 
         onTokenExpired();
      }

      // return false; 
    };

    
    checkTokenExpiry();

    
    const interval = setInterval(checkTokenExpiry, 60000);
    
   
    return () => clearInterval(interval);
  }, [onTokenExpired]); 

  return null;
};

export default TokenExpiryCheck;

