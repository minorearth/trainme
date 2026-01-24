"use client";
import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";

const LinearProgressWithLabel = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  return (
    <Box sx={{ width: "100%", padding: "10px" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{ height: 20, borderRadius: "10px" }}
          />
        </Box>
        <Box sx={{ minWidth: 60 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: 22 }}
          >
            {label}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;
