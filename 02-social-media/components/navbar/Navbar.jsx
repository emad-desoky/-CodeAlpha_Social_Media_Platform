import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";
import styles from "./Navbar.module.css"; // Ensure you have a CSS module for styling

// Define animation variants for the gradient background
const gradientAnimation = {
  hidden: { backgroundPosition: "0% 0%" },
  visible: {
    backgroundPosition: "100% 100%",
    transition: {
      backgroundPosition: {
        duration: 20,
        ease: "linear",
        repeat: "infinite",
      },
    },
  },
};

const Navbar = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={gradientAnimation}
      style={{
        position: "relative",
        width: "100%",
        background: "linear-gradient(to right, #002147, #4b0082, #002147)",
        backgroundSize: "200% 200%",
        height: "64px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Add shadow for depth
      }}
    >
      <AppBar
        position="static"
        sx={{
          bgcolor: "transparent",
          color: "white",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="home"
              className={styles.icon}
            >
              <HomeIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="videos"
              className={styles.icon}
            >
              <VideoLibraryIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="groups"
              className={styles.icon}
            >
              <GroupIcon />
            </IconButton>
          </div>
          <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                "& fieldset": {
                  border: "none",
                },
                "&:hover fieldset": {
                  border: "none",
                },
                "&.Mui-focused fieldset": {
                  border: "none",
                },
                "& input": {
                  color: "white", // Set text color to white
                },
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.7)", // Set placeholder color to a lighter white
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            color="inherit"
            aria-label="profile"
            className={styles.icon}
          >
            <Avatar
              alt="Profile Picture"
              src="/path/to/your/pfp.jpg"
              sx={{ width: 24, height: 24 }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
