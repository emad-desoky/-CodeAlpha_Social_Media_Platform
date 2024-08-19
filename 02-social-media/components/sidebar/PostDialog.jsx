import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useSpring, animated } from "@react-spring/web";
import { IconButton } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import { v4 } from "uuid";
import axios from "axios";
import Image from "next/image";

export default function PostDialog({ openDialog, handleCloseDialog, loggedUser, setRefetch}) {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [media, setMedia] = useState(null);

  const dialogProps = useSpring({
    opacity: openDialog ? 1 : 0,
    transform: openDialog ? "scale(1)" : "scale(0.9)",
    config: { tension: 300, friction: 30 },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMedia(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const newPost = {
      id: v4(),
      username: loggedUser.username, // Replace with actual username
      date: new Date().toISOString(),
      post: {
        image: media,
        text: postContent,
      },
      likes: 0,
      shares: 0,
    };

    axios.post("/api/posts", newPost)
    .then(res => {
      console.log("Post Created Successfully: " + res.data);
      setRefetch(prev => !prev);
    })
    .catch(e => console.error("Error creating post: ", e));

    handleCloseDialog();
  };

  return (
    <Dialog open={openDialog} onClose={handleCloseDialog}>
      <animated.div style={dialogProps}>
        <DialogTitle>Create a Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Post Title"
            type="text"
            fullWidth
            variant="standard"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            id="content"
            label="Post Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            inputProps={{ maxLength: 280 }}
          />
          <input
            accept="image/*,video/*"
            style={{ display: "none" }}
            id="media-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="media-upload">
            <IconButton color="primary" component="span">
              <PhotoCameraIcon />
            </IconButton>
            <IconButton color="primary" component="span">
              <VideocamIcon />
            </IconButton>
          </label>
          {media && (
            <div>
              {media.endsWith(".mp4") || media.endsWith(".mov") ? (
                <video src={media} controls style={{ maxWidth: "100%" }} />
              ) : (
                <Image
                  src={media}
                  alt="Post media"
                  style={{ maxWidth: "100%" }}
                />
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Post</Button>
        </DialogActions>
      </animated.div>
    </Dialog>
  );
};