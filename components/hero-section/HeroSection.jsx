import React, { useState } from "react";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useRouter } from "next/router";

const HeroSection = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const titleAnimation = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const buttonAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  const router = useRouter();

  const handleButtonClick = () => {
    if (!localStorage.getItem("user")) {
      setOpenSnackbar(true);
      return;
    }
    router.push("/platform");
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full text-white p-8 bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 bg-[length:400%_400%] animate-gradient-motion">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={titleAnimation}
        className="text-center mb-8"
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" },
          }}
        >
          Welcome to CodeAlpha Social
        </Typography>
        <Typography
          variant="h6"
          color="inherit"
          sx={{
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
              md: "1.5rem",
              lg: "1.75rem",
            },
          }}
        >
          Connect with friends and the world around you on CodeAlpha.
        </Typography>
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={buttonAnimation}>
        <Button
          variant="contained"
          size="large"
          color="secondary"
          sx={{
            padding: { xs: "8px 16px", sm: "12px 24px", md: "14px 28px" },
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "#f50057",
              boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
          onClick={handleButtonClick}
        >
          Join Us Now
        </Button>
      </motion.div>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Please log in first to join!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default HeroSection;
