"use client";
import { useColorScheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import "./MonacoEditor.css";
import Box from "@mui/material/Box";

import { observer } from "mobx-react-lite";

import MonacoCommonEd from "./MonacoCommonEd";
import { useEffect } from "react";

const MonacoEd = observer((props: any) => {
  const { mode } = useColorScheme();
  const { info, errorMessage, monacostore } = props;

  useEffect(() => {}, []);

  return (
    <Box
      className="watchmonaco"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: "10px",
      }}
    >
      {info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {info}
        </Typography>
      )}
      {errorMessage && !monacostore.editordisabled && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {errorMessage}
        </Typography>
      )}
      <MonacoCommonEd {...props} />
    </Box>
  );
});

export default MonacoEd;
