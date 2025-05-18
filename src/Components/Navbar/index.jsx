import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaChartLine, FaBell, FaSignOutAlt } from "react-icons/fa";
import { getUser } from "../../app/actions/user.actions";
import { logout } from "../../app/slices/user.slice";
import Profile from "../../Pages/Profile";
import NotificationDropdown from "../NotificationDropdown";
import UserImage from "../../assets/user.jpeg";

Modal.setAppElement("div");

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    if (
      sessionStorage.getItem("Authorization") &&
      sessionStorage.getItem("userId")
    ) {
      if (!user.loginStatus) {
        dispatch(getUser(sessionStorage.getItem("userId")));
      }
    }

    if (!sessionStorage.getItem("Authorization")) {
      navigate("/login");
    }
  }, [dispatch, user.loginStatus]);

  return (
    <div>
      <nav className={`navbar ${user.loginStatus ? "navbar-dark" : "navbar-light"}`} 
        style={user.loginStatus ? { 
          background: "linear-gradient(to right, #3a4f7a, #1e3163)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        } : { backgroundColor: "#f8f9fa" }}
      >
        <div className="container-fluid">
          {/* Removed logo as requested */}
          <Link className="navbar-brand" to="/">
            <span className="fw-bold" style={{ color: user.loginStatus ? "white" : "#333" }}>
              Skill Sharing
            </span>
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>
            {user.loginStatus ? (
              <div className="d-flex align-items-center gap-3">
                <Link className="nav-link d-flex align-items-center" to="/" style={{ color: "white" }}>
                  <FaHome className="me-1" /> Home
                </Link>
                <Link className="nav-link d-flex align-items-center" to="/user" style={{ color: "white" }}>
                  <FaUser className="me-1" /> Profile
                </Link>
                <Link className="nav-link d-flex align-items-center" to="/progress" style={{ color: "white" }}>
                  <FaChartLine className="me-1" /> Progress
                </Link>
                
                <NotificationDropdown />
                
                <button
                  className="btn btn-outline-light d-flex align-items-center"
                  onClick={() => {
                    dispatch(logout());
                  }}
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </button>

                <div
                  onClick={openModal}
                  className="d-flex align-items-center text-decoration-none cursor-pointer"
                  style={{color: "white"}}
                >
                  <img
                    src={
                      user?.user?.profileImage
                        ? user.user.profileImage
                        : UserImage
                    }
                    className="user-profile-image rounded-circle me-2"
                    alt="Profile"
                    style={{ width: "36px", height: "36px", objectFit: "cover" }}
                  />
                  <span className="fw-bold">{user?.user?.username}</span>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-primary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Profile Modal"
        style={customModalStyles}
      >
        <div className="p-2">
          <Profile closeModal={closeModal} />
        </div>
      </Modal>
    </div>
  );
}

// Custom modal styles
const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    backgroundColor: 'transparent',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

export default Navbar;