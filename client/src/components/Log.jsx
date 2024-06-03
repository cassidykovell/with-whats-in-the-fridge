import React, { useState } from "react";

const Sign = () => {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log("Signing up...");
  };

  const handleLogin = () => {
    // Handle login logic here
    console.log("Logging in...");
  };

  return (
    <div className="sign-container">
      <div className="sign-up-form">
        <h2 id="sign-head">Sign Up</h2>
        <input
          className="input"
          type="text"
          placeholder="Username"
          value={signUpUsername}
          onChange={(e) => setSignUpUsername(e.target.value)}
        />
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={signUpEmail}
          onChange={(e) => setSignUpEmail(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={signUpPassword}
          onChange={(e) => setSignUpPassword(e.target.value)}
        />
        <button onClick={handleSignUp} id="sign-btn">Sign Up</button>
      </div>

      <div className="divider"></div>

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
    </div>
  );
};

export default Sign;
