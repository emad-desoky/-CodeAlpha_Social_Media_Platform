import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SearchIcon from "@mui/icons-material/Search";
import { motion } from "framer-motion";

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

const ChatDialog = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState(friendsData || []); // Initialize with imported data

  useEffect(() => {
    if (!friendsData || friendsData.length === 0) {
      // If friendsData is not loaded via import, fetch it dynamically
      fetch("/path/to/friends.json")
        .then((response) => response.json())
        .then((data) => setFriends(data));
    }
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <IconButton
        color="inherit"
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1300,
          backgroundColor: "#002147",
          "&:hover": {
            backgroundColor: "#4b0082",
          },
        }}
      >
        <ChatIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            color: "white",
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gradientAnimation}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(to right, #002147, #4b0082, #002147)",
            backgroundSize: "200% 200%",
          }}
        >
          <Box sx={{ padding: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
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
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
              }}
              value={search}
              onChange={handleSearchChange}
            />
            <List sx={{ marginTop: 2 }}>
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => (
                  <React.Fragment key={index}>
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar alt={friend.username} src={friend.pfp} />
                      </ListItemAvatar>
                      <ListItemText primary={friend.username} />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No friends found" />
                </ListItem>
              )}
            </List>
          </Box>
        </motion.div>
      </Drawer>
    </>
  );
};

export default ChatDialog;
