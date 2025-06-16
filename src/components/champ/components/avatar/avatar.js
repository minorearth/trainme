import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { avatars } from "./allavatars";
import user from "@/store/user";
import { observer } from "mobx-react-lite";

const AvatarSelector = observer(() => {
  const handleNext = () => {
    user.setAvatarId((user.avatarid + 1) % avatars.length);
  };

  const handlePrevious = () => {
    user.setAvatarId(user.avatarid - 1 + avatars.length) % avatars.length;
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
        {avatars[user.avatarid]}
      </Box>
      <IconButton onClick={handleNext}>
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
});

export default AvatarSelector;
