import React from "react";
import { useSelector } from "react-redux";
import UserImage from "../../assets/user.jpeg";

function UserProfile() {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="card post"style={{top: "30px",right:"10px", border: "1px solid #dee2e6",
                  backgroundColor: "#f8f9fa",
                  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",borderRadius:"15px"}}>
      <div className="card-body text-center">
        <img
          className="img-circle user-image image-fluid mb-3"
          src={user?.profileImage ? user.profileImage : UserImage}
          alt="ss"
        />
        <h5 className="card-title">{user?.username}</h5>
        <p className="card-title">{user?.email}</p>
        <p className="card-title">{user?.contactNumber}</p>

      </div>
    </div>
  );
}

export default UserProfile;
