import React, { useEffect,useState  } from "react";
import Posts from "../../Components/Posts";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByUserId } from "../../app/actions/post.actions";
import PostAdd from "../../Components/PostProgress/index";
import UserProfile from "./user-profile";
import SharedPosts from "../SharedPosts";
import Notifications from "../../Components/NotificationList";

function User() {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post);
  const user = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("posts");


  useEffect(() => {
    if (user.userId) {
      dispatch(getPostsByUserId(user.userId));
    }
  }, [dispatch, user.userId]);

  return (
    <div className="container mt-3 mb-5 row" >
      
      {/* Left Column */}
      <div className="col-md-3">
        <UserProfile />
      </div>
  
      {/* Center Column */}
      <div className="col-md-9 d-flex flex-column align-items-center"style={{ maxWidth: "600px", width: "100%" ,left:"100px"}}>
        {/* PostAdd */}
        <div style={{ maxWidth: "600px", width: "100%" ,left:"50px"}}>
          <PostAdd />
        </div>
  
        {/* Custom React Tabs */}
        <div style={{ maxWidth: "600px", width: "100%", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button
              onClick={() => setActiveTab("posts")}
              style={{
                backgroundColor: activeTab === "posts" ? "#33407e" : "#f8f9fa",
                color: activeTab === "posts" ? "#fff" : "#000",
                border: activeTab === "posts" ? "none" : "1px solid #ced4da",
                padding: "8px 16px",
                borderRadius: "5px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              POSTS
            </button>
            <button
              onClick={() => setActiveTab("shared")}
              style={{
                backgroundColor: activeTab === "shared" ? "#33407e" : "#f8f9fa",
                color: activeTab === "shared" ? "#fff" : "#000",
                border: activeTab === "shared" ? "none" : "1px solid #ced4da",
                padding: "8px 16px",
                borderRadius: "5px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              SHARED POSTS
            </button>
          </div>

          <div
            style={{
              padding: "1rem",
              border: "1px solid #dee2e6",
              backgroundColor: "#f9f9fb",
              boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",
              marginTop: "1rem",
              borderRadius: "15px",
            }}
          >
            {activeTab === "posts" ? (
              <Posts posts={post.posts} fetchType="GET_ALL_USER_POSTS" />
            ) : (
              <SharedPosts />
            )}
          </div>
        </div>
      </div>
  
      {/* Right Column */}
      <div className="col-md-3" style={{ position: "fixed", top: "150px", right: "50px" , border: "1px solid #dee2e6",
              backgroundColor: "#f8f9fa",
              boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.25)",borderRadius:"10px"}}>
        <Notifications />
      </div>
    </div>
  );
}

export default User;
