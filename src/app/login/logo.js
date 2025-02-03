"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import background from "./background.json";
import dynamic from "next/dynamic";
import { useTheme } from "@mui/material/styles";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const Logo = () => {
  // const { customTheme } = useCustomTheme();
  // const theme = useTheme();

  return (
    // <Box
    //   sx={{
    //     backgroundColor: theme.palette.background.default,
    //     flex: 1,
    //   }}
    // >
    <Lottie animationData={background} loop={true}></Lottie>
    // </Box>
  );
};
export default Logo;
