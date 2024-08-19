import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import axios from 'axios';
import React from 'react'

export default function LoginDialog({openLoginDialog, handleCloseLoginDialog, setLoggedUser}) {

    const handleLogin = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = Object.fromEntries(formData.entries());
    
        // Assuming successful login+
        axios.post("api/login", user).then((res) => {
          if (!res.data.message) {
            setLoggedUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            // Close the login dialog
            handleCloseLoginDialog();
          } else {
            alert("invalid email or password");
          }
        });
      };

    return (
        <Dialog
            open={openLoginDialog}
            onClose={handleCloseLoginDialog}
        >
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <form onSubmit={handleLogin} className="flex flex-col gap-2">
                    <TextField
                        name="username"
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Login
                    </Button>
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleCloseLoginDialog}
                    color="primary"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}
