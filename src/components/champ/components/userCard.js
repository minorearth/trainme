import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Animation from "@/components/common/animation/Animation";

const UserCard = ({ name, pts, change }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        // gap: "20px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          R
        </Avatar>
        <Typography variant="h6">{name}</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Animation height={"25px"} width={"25px"} name={"coins"} />
        <Typography variant="h6">{`${pts}`}</Typography>
        <Typography variant="h6">{`${change}`}</Typography>
      </Box>
    </Box>
  );
};

export default UserCard;
