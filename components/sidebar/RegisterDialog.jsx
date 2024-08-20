import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material'
import { animated, useSpring } from "@react-spring/web";
import axios from 'axios';
import { useState } from 'react';


export default function RegisterDialog({ openRegistrationDialog, handleCloseRegistrationDialog, setSnackbarMessage, setSnackbarOpen }) {
  const [registrationData, setRegistrationData] = useState({
    username: "",
    password: "",
    age: "",
    email: "",
    country: "",
    pfp: ""
  });

   // Animation for Registration Dialog
   const registrationDialogProps = useSpring({
    opacity: openRegistrationDialog ? 1 : 0,
    transform: openRegistrationDialog ? "scale(1)" : "scale(0.9)",
    config: { tension: 300, friction: 30 },
});

  const handleRegister = async () => {
    if (validateRegistrationData()) {
      axios.post("/api/users", registrationData).then(res => {
        if (res.data.message)
        {
          alert(res.data.message);
        }
        else
        {
          console.log("Registration successful: ", res.data)
          // Clear the registration form
          setRegistrationData({
            username: "",
            password: "",
            age: "",
            email: "",
            country: "",
            pfp: ""
          });
  
          handleCloseRegistrationDialog(false);
        }
        
      }).catch(error => {
        console.log(error);
        setSnackbarMessage("Failed to register. Please try again.");
        setSnackbarOpen(true);
      });
    }
  };

  const validateRegistrationData = () => {
    const { username, password, age, email, country, pfp } = registrationData;
    if (!username || !password || !age || !email || !country || !pfp) {
      setSnackbarMessage("All fields are required.");
      setSnackbarOpen(true);
      return false;
    }
    if (isNaN(age) || age <= 0) {
      setSnackbarMessage("Age must be a positive number.");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  return (
    <Dialog
      open={openRegistrationDialog}
      onClose={handleCloseRegistrationDialog}
    >
      <animated.div style={registrationDialogProps}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={registrationData.username}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                username: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={registrationData.password}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                password: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="age"
            label="Age"
            type="number"
            fullWidth
            variant="standard"
            value={registrationData.age}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                age: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={registrationData.email}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                email: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="country"
            label="Country"
            type="text"
            fullWidth
            variant="standard"
            value={registrationData.country}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                country: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            id="pfp"
            label="Profile Picture URL"
            type="text"
            fullWidth
            variant="standard"
            value={registrationData.pfp}
            onChange={(e) =>
              setRegistrationData({
                ...registrationData,
                pfp: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegistrationDialog}>Cancel</Button>
          <Button onClick={handleRegister}>Register</Button>
        </DialogActions>
      </animated.div>
    </Dialog>
  )
}
