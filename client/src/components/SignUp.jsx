import React, { useState } from "react";

const SignUp = () => {
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log("Signing up...");
  };

  return (
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
  );
};

export default SignUp;