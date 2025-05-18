import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { login } from "../../app/actions/user.actions";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";
import "./Login.css";

function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username,
      password,
    };
    dispatch(login(user));
  };

  return (
    <div className="login-container">
      {/* Left side - Colored background (swapped from right) */}
      <div className="login-color-container" style={{ backgroundColor: "#5858FA" }}>
        <div className="color-side-content">
          <h2>Welcome to Our Platform</h2>
          <p>Sign in to access your personalized dashboard and features</p>
        </div>
      </div>
      
      {/* Right side - White background with login form (swapped from left) */}
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Please enter your credentials to login</p>
          
          <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your password"
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            
            <button type="submit" className="login-button">
              Login <FaArrowRight className="button-icon" />
            </button>
          </form>
          
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;