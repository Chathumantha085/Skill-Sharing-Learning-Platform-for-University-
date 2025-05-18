import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUserById } from "../../app/actions/user.actions";
import { deleteUserById } from "../../app/actions/user.actions";

function Profile(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  
  // State for success message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [username, setUsername] = useState(user?.user?.username);
  const [email, setEmail] = useState(user?.user?.email);
  const [contactNumber, setContactNumber] = useState(user?.user?.contactNumber);
  const [country, setCountry] = useState(user?.user?.country);
  const [profileImage, setProfileImage] = useState(user?.user?.profileImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    dispatch(getUser(user.userId));
  }, [dispatch]);

  const handleSubmit = () => {
    const userUpdate = {
      id: user.user.id,
      username,
      email,
      contactNumber,
      country,
      profileImage
    };

    dispatch(updateUserById(userUpdate));

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000); // Hide success message after 3 seconds

    props.closeModal();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      dispatch(deleteUserById(user.userId));
      props.closeModal();
    }
  };
  
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social_media");
    formData.append("cloud_name", "drieknquk");

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drieknquk/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setProfileImage(data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadToCloudinary(file);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Photography theme styles
  const photoThemeStyles = {
    container: {
      maxWidth: "450px",
      margin: "0 auto"
    },
    header: {
      backgroundImage: "linear-gradient(to right, #2c3e50, #4b6cb7)",
      borderBottom: "none"
    },
    profileImageWrapper: {
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
      border: "3px solid #fff"
    },
    cameraButton: {
      backgroundColor: "#2c3e50",
      borderColor: "#2c3e50"
    },
    formContainer: {
      backgroundColor: "#f8f9fa"
    }
  };

  return (
    <div className="container-fluid px-0" style={photoThemeStyles.container}>
      <div className="card border-0 shadow">
        {/* Header with photography theme */}
        <div 
          className="card-header text-white d-flex justify-content-between align-items-center p-3" 
          style={photoThemeStyles.header}
        >
          <div className="d-flex align-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-camera me-2" viewBox="0 0 16 16">
              <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2.002 2.002 0 0 0 2 2h12a2.002 2.002 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
              <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
            </svg>
            <h5 className="mb-0 fw-bold">Profile</h5>
          </div>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => props.closeModal()}
            aria-label="Close"
          ></button>
        </div>
        
        {/* Profile Image */}
        <div className="text-center position-relative mt-3 mb-1">
          <div className="position-relative d-inline-block">
            <div 
              className="rounded-circle bg-white shadow-sm" 
              style={{...photoThemeStyles.profileImageWrapper, width: "110px", height: "110px", overflow: "hidden" }}
            >
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="rounded-circle img-fluid h-100 w-100"
                  style={{ objectFit: "cover" }} 
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-person text-secondary" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                  </svg>
                </div>
              )}
            </div>
            
            <label 
              htmlFor="profileImageUpload" 
              className="btn btn-sm rounded-circle position-absolute bottom-0 end-0 shadow-sm"
              style={{ ...photoThemeStyles.cameraButton, cursor: "pointer", width: "32px", height: "32px", padding: "0", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2.002 2.002 0 0 0 2 2h12a2.002 2.002 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z"/>
                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
              </svg>
              <input 
                id="profileImageUpload" 
                type="file" 
                className="d-none" 
                onChange={handleImageUpload}
                accept="image/*"
              />
            </label>
          </div>
          
          {profileImage && (
            <div className="mt-2">
              <button 
                type="button"
                onClick={() => setProfileImage(null)} 
                className="btn btn-link btn-sm text-danger p-0"
                style={{ fontSize: "0.85rem" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-trash3 me-1" viewBox="0 0 16 16">
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                </svg>
                Remove Photo
              </button>
            </div>
          )}
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="px-4 mt-2">
            <div className="progress" style={{ height: "5px" }}>
              <div 
                className="progress-bar progress-bar-striped progress-bar-animated" 
                role="progressbar" 
                style={{ width: `${uploadProgress}%`, backgroundColor: "#4b6cb7" }} 
                aria-valuenow={uploadProgress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-center text-muted small mt-1" style={{ fontSize: "0.75rem" }}>Uploading... {uploadProgress}%</p>
          </div>
        )}
        
        {/* Form */}
        <div className="card-body p-3" style={photoThemeStyles.formContainer}>
          <form className="compact-form">
            <div className="mb-3">
              <label htmlFor="username" className="form-label small fw-bold text-muted mb-1">Username</label>
              <input
                type="text"
                className="form-control form-control-sm bg-light"
                id="username"
                value={username}
                readOnly
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-bold text-muted mb-1">Email Address</label>
              <input
                type="email"
                className="form-control form-control-sm"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              />
            </div>
            
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label htmlFor="contactNumber" className="form-label small fw-bold text-muted mb-1">Contact Number</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  pattern="[0-9]{10}"
                />
              </div>
              
              <div className="col-6">
                <label htmlFor="country" className="form-label small fw-bold text-muted mb-1">Country</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
            
            {/* Success Message */}
            {showSuccessMessage && (
              <div className="alert alert-success py-2 px-3 d-flex align-items-center small" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                <div>Profile updated successfully!</div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-sm flex-grow-1"
                style={{ backgroundColor: "#4b6cb7", color: "white" }}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Save'}
              </button>
              
              <button
                type="button"
                onClick={() => props.closeModal()}
                className="btn btn-sm btn-light flex-grow-1"
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
            
            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-link btn-sm text-danger p-0"
                style={{ fontSize: "0.85rem" }}
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;