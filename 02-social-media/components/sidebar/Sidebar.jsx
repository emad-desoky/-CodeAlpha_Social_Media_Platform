import { useState, useEffect } from "react";
import {Avatar, Button, InputBase, Typography, IconButton, Tooltip, Snackbar, Alert} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { styled } from "@mui/material/styles";
import PostDialog from "./PostDialog";
import { useRouter } from "next/router";
import RegisterDialog from "./RegisterDialog";
import SettingsDialog from "./SettingsDialog";
import LoginDialog from "./LoginDialog";

// Styled Avatar for Click Effect
const ClickableAvatar = styled(Avatar)({
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
  },
});




export default function Sidebar({setRefetch}) {
  const router = useRouter();

  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openRegistrationDialog, setOpenRegistrationDialog] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    document.getElementById("profile-picture-upload").click();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setProfilePicture(JSON.parse(storedUser).pfp)
    }
  }, []);


  const handleLogout = () => {
    // Remove user data from localStorage
    localStorage.removeItem("user");
    router.replace("/");

    setUser(null);
  };


  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg">
      {/* Header */}
      <Typography variant="h5" className="mb-4 font-semibold">
        CodeAlpha Social
      </Typography>

      {/* Profile Picture */}
      <div className="flex justify-center mb-4 relative">
        <ClickableAvatar
          alt="Profile Picture"
          src={profilePicture}
          sx={{ width: 96, height: 96 }}
          onClick={handleProfilePictureClick}
        />
        <input
          accept="image/*"
          id="profile-picture-upload"
          type="file"
          onChange={handleProfilePictureChange}
          style={{ display: "none" }}
        />
      </div>

      {/* Profile Section */}
      <div className="mb-4">
        <Typography variant="body1" align="center">
          {user ? `Welcome, ${user.username}` : "Your Profile"}
        </Typography>
      </div>

      {/* Search */}
      <div className="mb-4">
        <InputBase
          placeholder="Search..."
          fullWidth
          sx={{
            backgroundColor: "#333",
            borderRadius: 1,
            padding: "8px 16px",
            color: "#fff",
          }}
        />
      </div>

      {/* Notifications */}
      <div className="mb-4">
        <Tooltip title="Notifications">
          <IconButton
            className="w-full"
            color="inherit"
            onClick={() => console.log("Open Notifications")}
          >
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
      </div>

      {/* Create Post Button */}
      {user ? (
        <>
          <div className="mb-4">
            <Button
              variant="contained"
              className="w-full flex items-center justify-center"
              startIcon={<AddIcon />}
              onClick={() => setOpenPostDialog(true)}
            >
              Create Post
            </Button>
          </div>

          {/* Create Post Dialog */}
          <PostDialog
            loggedUser={user}
            openDialog={openPostDialog}
            handleCloseDialog={() => setOpenPostDialog(false)}
            setRefetch={setRefetch}
          />
        </>
      ) : (
        <></>
      )}

      {/* Login/Logout/Registration */}
      <div className="mb-4 flex flex-col gap-2">
        {user ? (
          <>
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outlined"
              className="w-full"
              startIcon={<ExitToAppIcon />}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<LoginIcon />}
              onClick={() => setOpenLoginDialog(true)}
            >
              Login
            </Button>

            {/* Login Dialog */}
            <LoginDialog openLoginDialog={openLoginDialog} handleCloseLoginDialog={() => setOpenLoginDialog(false)} setLoggedUser={setUser} />

            {/* Register Button */}
            <Button
              variant="outlined"
              className="w-full"
              startIcon={<PersonAddIcon />}
              onClick={() => setOpenRegistrationDialog(true)}
            >
              Register
            </Button>
          </>
        )}
      </div>

      {/* Settings */}
      <div className="mt-auto">
        <Button
          variant="outlined"
          className="w-full"
          startIcon={<SettingsIcon />}
          onClick={() => setOpenSettingsDialog(true)}
        >
          Settings
        </Button>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog openSettingsDialog={openSettingsDialog} handleCloseSettingsDialog={() => openSettingsDialog(false)} />

      {/* Registration Dialog */}
      <RegisterDialog openRegistrationDialog={openRegistrationDialog} handleCloseRegistrationDialog={() => setOpenRegistrationDialog(false)} setSnackbarMessage={setSnackbarMessage} setSnackbarOpen={setSnackbarOpen} />

      {/* Snackbar for Validation Messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};