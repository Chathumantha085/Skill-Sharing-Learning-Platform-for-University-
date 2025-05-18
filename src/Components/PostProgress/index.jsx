import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByUserId, savePost } from "../../app/actions/post.actions";

function PostAdd() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [imgLink, setImgLink] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

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
      setImgLink([]);
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
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleMediaUpload = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const maxMedia = 4;
    const numMedia = Math.min(maxMedia, files.length);
    setIsUploading(true);

    try {
      const uploadPromises = [];

      for (let i = 0; i < numMedia; i++) {
        const file = files[i];
        if (!file.type.match('image.*')) continue;

        uploadPromises.push(uploadToCloudinary(file));
      }

      const urls = await Promise.all(uploadPromises);
      setImgLink((prevLinks) => [...prevLinks, ...urls]);
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index) => {
    setImgLink(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1.5rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
        backgroundColor: "#f9f9fb",
        border: "1px solid #dee2e6",
        maxWidth: "600px",
        margin: "2rem auto",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1
          style={{
            marginTop: "0.5rem",
            marginBottom: "1rem",
            fontWeight: "700",
            fontSize: "1.75rem",
            color: "#000",
            backgroundColor: "#f9f9fb",
            padding: "0.5rem",
            borderRadius: "0.5rem"
          }}
        >
          Share Your Learning Progress
        </h1>
        <p
          style={{
            color: "#6c757d",
            marginBottom: "1rem",
            fontSize: "1rem"
          }}
        >
          Let your peers know how you're growing and what you've achieved!
        </p>
  
        <div style={{ marginTop: "0.75rem", marginBottom: "1rem" }}>
          <label
            style={{
              fontWeight: "600",
              color: "#212529",
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "1rem"
            }}
          >
            ✍️ What did you learn or accomplish today?
          </label>
          <textarea
            style={{
              width: "100%",
              fontSize: "1rem",
              border: "1px solid #33407e",
              borderRadius: "0.375rem",
              padding: "0.75rem",
              backgroundColor: "#ffffff",
              color: "#212529",
              resize: "vertical",
              lineHeight: "1.5"
            }}
            placeholder="Write Something..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="4"
            disabled={isUploading}
          />
        </div>
  
        <div style={{ marginBottom: "0.5rem", color: "#6c757d", fontSize: "0.9rem" }}>
          📸 Upload up to 4 images (optional)
        </div>
  
        {imgLink.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1rem"
            }}
          >
            {imgLink.map((link, index) => (
              <div key={index} style={{ position: 'relative' }}>
                <img
                  src={link}
                  alt={`Upload ${index + 1}`}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    border: "1px solid #33407e",
                    borderRadius: "0.5rem",
                    backgroundColor: "#ffffff"
                  }}
                />
                <button
                  onClick={() => removeMedia(index)}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '25px',
                    height: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
  
        <input
          type="file"
          onChange={handleMediaUpload}
          ref={fileInputRef}
          multiple
          accept="image/*"
          style={{
            display: "block",
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#ffffff",
            border: "1px solid #ced4da",
            borderRadius: "0.375rem",
            marginBottom: "1rem",
            fontSize: "1rem"
          }}
          disabled={isUploading}
        />
  
        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: isUploading ? "#6c757d" : "#33407e",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.375rem",
            fontWeight: "600",
            cursor: isUploading ? "not-allowed" : "pointer",
            fontSize: "1rem",
            boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)"
          }}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "🚀 Post Progress"}
        </button>

        {isUploading && (
          <div style={{
            marginTop: "1rem",
            color: "#33407e",
            fontSize: "0.9rem",
            textAlign: "center"
          }}>
            Please wait while we upload your images...
          </div>
        )}
      </form>
    </div>
  );
}

export default PostAdd;