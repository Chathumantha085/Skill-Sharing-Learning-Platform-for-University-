import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePostById,
  updatePostById,
  likePostById,
  getPosts,
  getPostsByUserId,
} from "../../app/actions/post.actions";
import { getAllUsers } from "../../app/actions/user.actions";
import { saveNotification } from "../../app/actions/notification.action";
import { getPostToShareById } from "../../app/slices/post.slice";
import { saveComment } from "../../app/actions/comment.actions";
import UserImage from "../../assets/user.jpeg";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiFillDelete,
  AiFillEdit,
} from "react-icons/ai";
import { TbShare3 } from "react-icons/tb";
import { GiCancel } from "react-icons/gi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdSend } from "react-icons/md";
import Comment from "../Comment";
import SharePostForm from "../SharePostForm";
import { Link } from "react-router-dom";
import { getPostShareByUserId } from "../../app/actions/postshare.actions";
import FollowButton from "../NewUsersSuggest/FollowButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PostCard.css";

Modal.setAppElement("div");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const getUserByIdFunc = (users, userId) => {
  const result = users.filter(function (el) {
    return el.id === userId;
  });

  return result ? result[0] : null;
};

function PostCard({ post, fetchType }) {
  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const user = useSelector((state) => state.user);
  const [captionEdit, setCaption] = React.useState(post.caption);
  const [imgLinkEdit, setImgLinkEdit] = React.useState(post.imgLink);
  const [comment, setComment] = React.useState("");
  const [isLiked, setIsLiked] = React.useState(false);
  const [isUploading, setIsUploading] = useState(false);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  useEffect(() => {
    if (post.likedby && post.likedby.length) {
      const userIdIndex = post.likedby.indexOf(user.userId);

      if (userIdIndex > -1) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [user]);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleSubmitComment = async () => {
    const newComment = {
      postId: post.id,
      userId: user.userId,
      text: comment,
    };
    await dispatch(saveComment(newComment));

    const newNotification = {
      message: "Commented by " + user.user.username + " on your post",
      userId: post.userId,
    };

    await dispatch(saveNotification(newNotification));
    if (fetchType === "GET_ALL_POSTS") {
      await dispatch(getPosts());
    }
    if (fetchType === "GET_ALL_USER_POSTS") {
      await dispatch(getPostShareByUserId(user.userId));
    }
    if (fetchType === "GET_ALL_POSTS_USER") {
      await dispatch(getPostShareByUserId(post.userId));
    }
    setComment("");
  };

  const handleSubmit = async () => {
    const newPost = {
      id: post.id,
      userId: user.userId,
      caption: captionEdit,
      imgLink: imgLinkEdit,
    };
    await dispatch(updatePostById(newPost));
    if (fetchType === "GET_ALL_POSTS") {
      await dispatch(getPosts());
    }
    if (fetchType === "GET_ALL_USER_POSTS") {
      await dispatch(getPostShareByUserId(user.userId));
    }
    if (fetchType === "GET_ALL_USER_POSTS") {
      await dispatch(getPostsByUserId(user.userId));
    }
    setEditable(false);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social_media");
    formData.append("cloud_name", "drieknquk");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drieknquk/${file.type.includes("video") ? "video" : "image"}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const maxMedia = 4;
    const numMedia = Math.min(maxMedia, files.length);
    setIsUploading(true);

    try {
      const uploadPromises = [];

      for (let i = 0; i < numMedia; i++) {
        const file = files[i];
        if (!file.type.match('image.*|video.*')) continue;

        uploadPromises.push(uploadToCloudinary(file));
      }

      const urls = await Promise.all(uploadPromises);
      setImgLinkEdit((prevLinks) => [...prevLinks, ...urls]);
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index) => {
    setImgLinkEdit(prev => prev.filter((_, i) => i !== index));
  };

  const handleLikePost = async () => {
    const tempLikeArray = post.likedby ? post.likedby.slice() : [];
    const userId = user.userId.toString();
    const userIdIndex = tempLikeArray.indexOf(userId);

    if (userIdIndex > -1) {
      tempLikeArray.splice(userIdIndex, 1);
      setIsLiked(false);
    } else {
      tempLikeArray.push(userId);
      setIsLiked(true);
    }

    const likedPost = {
      id: post.id,
      likedby: tempLikeArray,
    };

    await dispatch(likePostById(likedPost));
    if (fetchType === "GET_ALL_POSTS") {
      await dispatch(getPosts());
    }
    if (fetchType === "GET_ALL_USER_POSTS") {
      await dispatch(getPostsByUserId(post.userId));
      await dispatch(getPostShareByUserId(user.userId));
    }
    if (fetchType === "GET_ALL_POSTS_USER") {
      await dispatch(getPostsByUserId(post.userId));
      await dispatch(getPostShareByUserId(post.userId));
    }
    const newNotification = {
      message: "Like by " + user.user.username + " on your post",
      userId: post.userId,
    };

    await dispatch(saveNotification(newNotification));
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link
          className="user-info"
          to={{ pathname: `/user/${post.userId}` }}
        >
          <img
            src={post.profileImage ? post.profileImage : UserImage}
            className="user-avatar"
            alt="Profile"
          />
          <div className="user-details">
            <span className="username">{post.username}</span>
            <FollowButton
              userDetails={getUserByIdFunc(user.users, post.userId)}
            />
          </div>
        </Link>

        {user.userId === post.userId && (
          <div className="post-actions">
            {editable ? (
              <>
                <button className="icon-button" onClick={() => setEditable(false)}>
                  <GiCancel size={20} />
                </button>
                <button 
                  className="icon-button confirm-button" 
                  onClick={handleSubmit}
                  disabled={isUploading}
                >
                  <IoCheckmarkDoneSharp size={20} />
                </button>
              </>
            ) : (
              <>
                <button className="icon-button" onClick={() => setEditable(true)}>
                  <AiFillEdit size={20} />
                </button>
                <button className="icon-button delete-button" onClick={() => dispatch(deletePostById(post.id))}>
                  <AiFillDelete size={20} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        {editable ? (
          <textarea
            className="edit-caption"
            value={captionEdit}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind?"
          />
        ) : (
          <p className="post-caption">{post.caption}</p>
        )}

        {imgLinkEdit && imgLinkEdit.length > 0 && (
          <div className="post-images">
            <Slider>
              {imgLinkEdit.map((mediaLink, index) => {
                const isVideo = /\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i.test(mediaLink);

                return (
                  <div key={index} className="media-slide">
                    {isVideo ? (
                      <video
                        controls
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                      >
                        <source src={mediaLink} type={`video/${mediaLink.split('.').pop()}`} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={mediaLink}
                        alt={`Post ${index}`}
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'contain' }}
                      />
                    )}
                    {editable && (
                      <button 
                        className="remove-media-btn" 
                        onClick={() => removeMedia(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </Slider>
          </div>
        )}

        {editable && (
          <div className="image-upload">
            <label className="upload-button">
              {isUploading ? 'Uploading...' : 'Upload Images/Videos (max 4)'}
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar"></div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-stats">
        <div className="stat-item">
          {isLiked ? (
            <AiFillLike className="liked" onClick={handleLikePost} />
          ) : (
            <AiOutlineLike onClick={handleLikePost} />
          )}
          <span>{post.likedby ? post.likedby.length : 0}</span>
        </div>
        <div className="stat-item">
          <AiOutlineComment />
          <span>{post.comments ? post.comments.length : 0}</span>
        </div>
        <div className="stat-item">
          <TbShare3 onClick={() => {
            dispatch(getPostToShareById(post.id));
            openModal();
          }} />
        </div>
      </div>

      <div className="comment-section">
        <div className="comment-input-container">
          <input
            type="text"
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button className="send-button" onClick={handleSubmitComment}>
            <MdSend size={20} />
          </button>
        </div>

        {post.comments && post.comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            postId={post.id}
            postUserId={post.userId}
            fetchType={fetchType}
          />
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Share Post"
        overlayClassName="share-modal-overlay"
      >
        <div className="share-modal-content">
          <SharePostForm closeModal={closeModal} />
        </div>
      </Modal>
    </div>
  );
}

export default PostCard;