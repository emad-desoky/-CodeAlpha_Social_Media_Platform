import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  IconButton,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styles from "./Posts.module.css";
import axios from "axios";
import { v4 } from "uuid";
import { date } from "yup";

// Helper function to convert date to "x time ago"
const timeAgo = (date) => {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000); // difference in seconds
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

export default function Posts({ posts, users, comments, setRefetch }) {
  const [user, setUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [textInputs, setTextInputs] = useState({}); // Store comment text for each post

  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const handleLike = (postId) => {
    if (user.likedPosts.find((p) => p == postId)) {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          likedPosts: prev.likedPosts.filter((p) => p != postId),
        };
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Send the updated data to the backend
        axios
          .put(`/api/users`, updatedUser)
          .then((response) => {
            setRefetch((prev) => !prev);
            console.log("User updated successfully", response.data);
          })
          .catch((error) => {
            console.error("Failed to update user", error);
          });

        return updatedUser;
      });
    } else {
      setUser((prevUser) => {
        // Ensure likedPosts is an array
        const currentLikedPosts = Array.isArray(prevUser.likedPosts)
          ? prevUser.likedPosts
          : [];

        const updatedUser = {
          ...prevUser,
          likedPosts: Array.from(new Set([...currentLikedPosts, postId])),
        };

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Send the updated user data to the backend
        axios
          .put(`/api/users`, updatedUser)
          .then((response) => {
            setRefetch((prev) => !prev);
            console.log("User updated successfully", response.data);
          })
          .catch((error) => {
            console.error("Failed to update user", error);
          });

        return updatedUser;
      });
    }
  };

  // Example useEffect to load the user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        ...userData,
      });
    }
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleFollows = (username) => {
    setUser((prev) => {
      let updatedUser;
      if (prev.following.find((f) => f == username)) {
        updatedUser = {
          ...prev,
          following: prev.following.filter((f) => f != username),
        };
      } else {
        updatedUser = {
          ...prev,
          following: Array.from(new Set([...prev.following, username])),
        };
      }

      axios.put("api/users", updatedUser);
      axios
        .get("/api/users", {
          params: {
            username: username,
          },
        })
        .then((res) => {
          const updatedUser = {
            ...res.data,
            followers: res.data.followers.find((f) => f == user.username)
              ? res.data.followers.filter((f) => f !== user.username)
              : Array.from(new Set([...res.data.followers, user.username])),
          };
          console.log(updatedUser);

          axios.put("api/users", updatedUser);
        });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };
  const handleInputChange = (event, postId) => {
    setTextInputs({
      ...textInputs,
      [postId]: event.target.value, // Update the specific post's comment input
    });
  };

  const handleSubmit = (postId) => {
    const postData = {
      id: v4(),
      postId: postId,
      text: textInputs[postId] || "", // Get the comment text for this post
      username: user.username,
      date: new Date().toISOString(),
    };

    axios
      .post("api/comments", postData)
      .then((response) => {
        console.log("Response:", response.data);
        setTextInputs({ ...textInputs, [postId]: "" }); // Clear the input field after submission
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-full w-full text-white p-8 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 bg-[length:400%_400%] animate-gradient-motion">
      <div className={styles.container}>
        {posts &&
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial="hidden"
              animate="visible"
              variants={cardAnimation}
              className={styles.card}
            >
              <Card
                className={styles.card}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255, 255, 255, 0.001)",
                  "& .MuiTypography-root": {
                    color: "white",
                    fontWeight: "bold",
                  },
                  "& .MuiCardHeader-title": {
                    color: "gray",
                    fontWeight: "bold",
                  },
                  "& .MuiCardHeader-subheader": {
                    color: "gray",
                  },
                  "& .MuiCardContent-root": {
                    color: "gray",
                  },
                  "& .MuiIconButton-root": {
                    color: "gray",
                  },
                  "& .MuiTextField-root input": {
                    color: "white", // Ensure text color inside TextField is white
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <>
                      <Avatar
                        src={
                          users
                            ? users.find((u) => u.username == post.username)
                                ?.pfp
                            : ""
                        }
                      />
                    </>
                  }
                  title={
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      {post.username}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body3" sx={{ color: "gray" }}>
                      {timeAgo(post.date)}
                    </Typography>
                  }
                  action={
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        className={styles.commentButton}
                        onClick={() => handleFollows(post.username)}
                      >
                        {user.following.find((f) => f == post.username)
                          ? "unfollow"
                          : "follow"}
                      </Button>

                      <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                    </>
                  }
                />

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Remove this post</MenuItem>
                </Menu>
                {post.post.image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.post.image}
                    alt="Post image"
                  />
                )}
                <CardContent>
                  <Typography variant="body2">{post.post.text}</Typography>
                </CardContent>
                <Box className={styles.actions}>
                  <Box className={styles.iconContainer}>
                    <IconButton
                      aria-label="like"
                      onClick={(e) => handleLike(post.id)}
                    >
                      {user.likedPosts.find((l) => l == post.id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Typography variant="body2" className={styles.iconText}>
                      {post.likes}
                    </Typography>
                  </Box>
                  <Box className={styles.iconContainer}>
                    <IconButton aria-label="comment">
                      <ModeCommentIcon />
                    </IconButton>
                    <Typography variant="body2" className={styles.iconText}>
                      {comments &&
                        comments.filter((c) => c.postId == post.id).length}
                    </Typography>
                  </Box>
                  <Box className={styles.iconContainer}>
                    <IconButton aria-label="share">
                      <ShareOutlinedIcon />
                    </IconButton>
                    <Typography variant="body2" className={styles.iconText}>
                      {post.shares}
                    </Typography>
                  </Box>
                </Box>
                <CardContent sx={{ borderTop: "1px solid gray", pt: 2 }}>
                  {comments &&
                    comments
                      .filter((c) => c.postId == post.id)
                      .map((comment, index) => (
                        <Box key={comment.id} className={styles.comment}>
                          <Avatar
                            src={
                              users.find((u) => u.username == comment.username)
                                ?.pfp
                            }
                          />
                          <Box ml={2}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: "bold", fontSize: "0.9rem" }}
                            >
                              {comment.username}
                            </Typography>
                            <Typography variant="body2">
                              {comment.text}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "gray" }}>
                              {timeAgo(comment.date)}
                            </Typography>
                          </Box>
                          <Box className={styles.iconContainer}>
                            <IconButton aria-label="like-comment">
                              <FavoriteBorderIcon />
                            </IconButton>
                            <Typography
                              variant="body2"
                              className={styles.iconText}
                            >
                              {comment.likes}
                            </Typography>
                          </Box>
                          {index <
                            comments.filter((c) => c.postId == post.id).length -
                              1 && <hr className={styles.commentSeparator} />}
                        </Box>
                      ))}
                  <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Write a comment..."
                    className={styles.commentField}
                    onChange={(e) => handleInputChange(e, post.id)} // Pass post ID to change handler
                    type="text"
                    value={textInputs[post.id] || ""} // Bind the input value to the specific post's comment
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.commentButton}
                    onClick={() => handleSubmit(post.id)}
                  >
                    Comment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
