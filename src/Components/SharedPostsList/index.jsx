import React, { useEffect, useState } from "react";
import SharedPostCard from "../SharedPostCard";

function SharedPostsList({posts, fetchType}) {
  const [postsList, setPostsList] = useState([]);

  useEffect(()=>{
    if(posts){
      setPostsList(posts);
    }
  },[posts]);

  return (
    <div style={{ maxWidth: "600px", width: "100%", marginTop: "1.5rem", backgroundColor: "#f9f9fb", borderRadius: "15px" }}>
      {/* system message will be displayed */}
        {postsList.length ? [...postsList].reverse().map((post) => {
          return <SharedPostCard key={post.id} post={post} fetchType={fetchType}/>;
        }) : <h5>No shared posts yet...</h5>}
    </div>
  );
}

export default SharedPostsList;
