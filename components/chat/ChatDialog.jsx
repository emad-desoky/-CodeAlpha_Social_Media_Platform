import React, { useState } from "react";
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
import styles from "./ChatDialog.module.css";

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

const friendsData = [
  { username: "JohnDoe", pfp: "/path/to/john.jpg" },
  { username: "JaneSmith", pfp: "/path/to/jane.jpg" },
  { username: "MichaelBrown", pfp: "/path/to/michael.jpg" },
];

const ChatDialog = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [friends] = useState(friendsData);

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
        classes={{ paper: styles.drawerPaper }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gradientAnimation}
          className={styles.gradientBackground}
        >
          <Box sx={{ padding: 2 }}>
            <TextField
              variant="outlined"
              placeholder="Search..."
              size="small"
              fullWidth
              className={styles.textField}
              InputProps={{
                classes: { root: styles.outlinedInputRoot },
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={styles.inputAdornment}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              value={search}
              onChange={handleSearchChange}
            />
            <List className={styles.listContainer}>
              {filteredFriends.length > 0 ? (
                filteredFriends.map((friend, index) => (
                  <React.Fragment key={index}>
                    <ListItem button>
                      <ListItemAvatar>
                        <Avatar alt={friend.username} src={friend.pfp} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={friend.username}
                        classes={{ primary: styles.listItemText }}
                      />
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
