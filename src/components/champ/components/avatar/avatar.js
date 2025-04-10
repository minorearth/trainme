import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { avatars } from "./allavatars";

const AvatarSelector = ({ currentIndex, setCurrentIndex }) => {
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % avatars.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + avatars.length) % avatars.length
    );
  };

  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={handlePrevious}>
        <ArrowBackIcon />
      </IconButton>
      <Box
        sx={{
          width: 100,
          height: 100,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid #ccc",
          borderRadius: "8px",
          margin: "0 10px",
        }}
      >
        {avatars[currentIndex]}
      </Box>
      <IconButton onClick={handleNext}>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

export default AvatarSelector;
