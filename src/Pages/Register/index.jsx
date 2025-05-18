import React from "react";
import { useDispatch } from "react-redux";
import { register } from "../../app/actions/user.actions";
import { FaUser, FaLock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import "./Register.css";
import { Link } from "react-router-dom";

function Register() {
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const user = {
      username,
      password,
    };

    dispatch(register(user));
  };

  return (
    <div className="register-container">
      {/* Left side - Colored background */}
      <div className="register-color-container" style={{ backgroundColor: "#5858FA" }}>
        <div className="color-side-content">
          <h2>Join Our Community</h2>
          <p>Create an account to access all features</p>
        </div>
      </div>
      
      {/* Right side - White background with register form */}
      <div className="register-form-container">
        <div className="register-form-wrapper">
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">Fill in your details to get started</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label className="form-label">
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>
            
            <button type="submit" className="register-button">
              Register <FaArrowRight className="button-icon" />
            </button>
          </form>
          
          <div className="login-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;