import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AnimationLottie from "@/components/common/animations/lottie/AnimationLottie";
import ArrowCircleUpOutlinedIcon from "@mui/icons-material/ArrowCircleUpOutlined";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import { GoDash } from "react-icons/go";

//components
import { avatars } from "@/components/champ/components/avatar/avatarsAll";
import { Champuser } from "@/types";

const UserCard = ({ user }: { user: Champuser }) => {
  const { name, pts, change, avatarid } = user;
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "60px",
            height: "60px",
          }}
        >
          {avatars[avatarid]}
        </Box>

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
            gap: "5px",
            marginRight: "40px",
          }}
        >
          <Typography variant="h6">{`${pts}`}</Typography>

          <AnimationLottie
            style={{ height: "25px", width: "25px" }}
            name={"coins"}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
            // gap: "10px",
            width: "60px",
          }}
        >
          {change > 0 ? (
            <ArrowCircleUpOutlinedIcon sx={{ color: "green" }} />
          ) : change < 0 ? (
            <ArrowCircleDownOutlinedIcon sx={{ color: "red" }} />
          ) : (
            <GoDash />
          )}
          <Box
            sx={{
              width: "40px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Typography variant="h6">
              {change > 0 ? `+${change}` : change < 0 ? change : ""}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserCard;
