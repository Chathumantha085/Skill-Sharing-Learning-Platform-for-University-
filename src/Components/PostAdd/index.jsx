import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByUserId, savePost } from "../../app/actions/post.actions";
import { FiImage, FiX, FiSend } from "react-icons/fi";
import { RiEmotionHappyLine } from "react-icons/ri";
import "./PostAdd.css";

function PostAdd() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [imgLink, setimgLink] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && imgLink.length === 0) return;

    setIsUploading(true);
    const post = {
      userId: user.userId,
      caption,
      imgLink,
    };

    try {
      await dispatch(savePost(post));
      await dispatch(getPostsByUserId(user.userId));
      setCaption("");
      setimgLink([]);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social_media");
    formData.append("cloud_name", "drieknquk");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/drieknquk/${file.type.includes("video") ? "video" : "image"
        }/upload`,
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

  const checkVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.includes("video")) {
        resolve(true); // Not a video, no need to check duration
        return;
      }

      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(new Error("Video duration exceeds 30 seconds"));
        } else {
          resolve(true);
        }
      };

      video.onerror = () => {
        reject(new Error("Invalid video file"));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const MAX_MEDIA = 3;
    const remainingSlots = MAX_MEDIA - imgLink.length;
    
    if (remainingSlots <= 0) {
      setError(`Maximum ${MAX_MEDIA} photos/videos allowed`);
      return;
    }

    const numMedia = Math.min(remainingSlots, files.length);
    setIsUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      // First check all videos for duration
      for (let i = 0; i < numMedia; i++) {
        const file = files[i];
        if (file.type.includes("video")) {
          await checkVideoDuration(file);
        }
      }

      // If all checks pass, proceed with upload
      const uploadPromises = [];

      for (let i = 0; i < numMedia; i++) {
        const file = files[i];
        if (!file.type.match('image.*|video.*')) continue;

        uploadPromises.push(uploadToCloudinary(file));
      }

      const urls = await Promise.all(uploadPromises);
      setimgLink((prevLinks) => [...prevLinks, ...urls]);
    } catch (error) {
      console.error("Error uploading media:", error);
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index) => {
    setimgLink(prev => prev.filter((_, i) => i !== index));
    setError("");
  };

  return (
    <div className="post-add-container">
      <div className="post-add-card">
        <div className="post-add-header">
          <div className="user-avatar">
            <img
              src={user?.user?.profileImage || "/default-avatar.png"}
              alt={user?.user?.username}
            />
          </div>
          <h3>Create Post</h3>
        </div>

        <form onSubmit={handleSubmit} className="post-add-form">
          <textarea
            className="post-caption"
            placeholder={`What's on your mind, ${user?.user?.username || 'friend'}?`}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
          />

          {error && <div className="error-message">{error}</div>}

          {imgLink.length > 0 && (
            <div className="media-preview-container">
              {imgLink.map((link, index) => (
                <div key={index} className="media-preview-item">
                  {link.includes('.mp4') || link.includes('.webm') || link.includes('.mov') ? (
                    <video controls>
                      <source src={link} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img src={link} alt={`Preview ${index}`} />
                  )}
                  <button
                    type="button"
                    className="remove-media-btn"
                    onClick={() => removeMedia(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="upload-progress">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span>Uploading... {uploadProgress}%</span>
            </div>
          )}

          <div className="post-add-footer">
            <div className="post-options">
              <label className="media-upload-btn">
                <FiImage className="icon" />
                <span>Photo/Video</span>
                <input
                  type="file"
                  onChange={handleMediaUpload}
                  ref={fileInputRef}
                  multiple
                  accept="image/*,video/*"
                  hidden
                />
              </label>

              <button type="button" className="emoji-btn">
                <RiEmotionHappyLine className="icon" />
              </button>
            </div>

            <button
              type="submit"
              className="post-submit-btn"
              disabled={isUploading || (!caption.trim() && imgLink.length === 0)}
            >
              <FiSend className="icon" />
              {isUploading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostAdd;