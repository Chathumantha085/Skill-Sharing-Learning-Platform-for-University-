import React, { useEffect, useState } from "react";
import PostCard from "../PostCard";
import "./Posts.css";

function Posts({ posts, fetchType }) {
  const [postsList, setPostsList] = useState([]);

  useEffect(() => {
    if (posts) {
      setPostsList(posts);
    }
  }, [posts]);

  return (
    <div className="posts-feed">
      {postsList.length ? (
        [...postsList].reverse().map((post) => (
          <PostCard key={post.id} post={post} fetchType={fetchType} />
        ))
      ) : (
        <div className="empty-feed">
          <div className="empty-feed-content">
            <img src="/empty-feed.svg" alt="No posts" />
            <h3>No posts yet</h3>
            <p>Be the first to share something with your community!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;