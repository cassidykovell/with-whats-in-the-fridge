import React, { useState } from "react";

const LogIn = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in...");
  };

  return (
        <div className="login-form">
        <h2 id="log-head">Login</h2>
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={loginUsername}
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={handleLogin} id="log-btn">Login</button>

      </div>
    
  );
};

export default LogIn;
