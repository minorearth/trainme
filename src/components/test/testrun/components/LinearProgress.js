"use client";
import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel({ value, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{ height: 20 }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {/* {`${Math.round(value)}%`} */}
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

export default function LinearWithValueLabel({ value, label }) {
  return (
    <Box sx={{ width: "100%", padding: "10px" }}>
      <LinearProgressWithLabel value={value} label={label} />
    </Box>
  );
}
