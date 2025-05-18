import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUserById, getAllUsers } from "../../app/actions/user.actions";
import { saveNotification } from "../../app/actions/notification.action";

function FollowButton({ userDetails, fetchType }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [followed, setFollowed] = useState(false);



  useEffect(() => {
    if (userDetails?.followedBy && userDetails.followedBy?.length) {
      const userIdIndex = userDetails.followedBy.indexOf(user.userId);

      if (userIdIndex > -1) {
        setFollowed(true);
      } else {
        setFollowed(false);
      }
    } else {
      setFollowed(false);
    }
  }, [user.users]);

  const handleOnFollow = async () => {
    const tempFollowingArray = userDetails.followedBy
      ? userDetails.followedBy.slice()
      : [];
    const userId = user.userId.toString();
    const userIdIndex = tempFollowingArray.indexOf(userId);

    if (userIdIndex > -1) {
      tempFollowingArray.splice(userIdIndex, 1);
      setFollowed(false);
    } else {
      tempFollowingArray.push(userId);
      setFollowed(true);
    }

    const followedUsers = {
      id: userDetails.id,
      followedBy: tempFollowingArray,
    };

    await dispatch(followUserById(followedUsers));
    await dispatch(getAllUsers());

    const newNotification = {
      message: "Followed by " + user.user.username,
      userId: userDetails.userId,
    };

    await dispatch(saveNotification(newNotification));
  };

  return (
    <>
      {followed ? (
        <button className="btn-follow btn-sm" onClick={handleOnFollow}>
          Unfollow
        </button>
      ) : (
        <button
          className="btn-follow btn-sm"
          onClick={handleOnFollow}
          style={{
            color: "#33407e",
            border: "1px solid #33407e",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "transparent",
            padding: "6px 12px",
            fontWeight: "600",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#33407e";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#33407e";
          }}
        >
          Follow
        </button>
      )}
    </>
  );
}

export default FollowButton;
