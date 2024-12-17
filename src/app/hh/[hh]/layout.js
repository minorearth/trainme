"use client";
import * as React from "react";
import Box from "@mui/material/Box";

const Layout = ({ children }) => {
  return <Box sx={{ height: window.innerHeight }}>{children}</Box>;
};

export default Layout;
