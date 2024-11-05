// src/authConfig.js
import React from 'react';
export const msalConfig = {
    auth: {
      clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
      authority: process.env.REACT_APP_AZURE_AUTHORITY_URL,
      redirectUri: process.env.REACT_APP_REDIRECT_URI,
    },
    cache: {
      cacheLocation: "sessionStorage", 
      storeAuthStateInCookie: false, 
    },
  };
  
  export const loginRequest = {
    scopes: ["User.Read"],
  };