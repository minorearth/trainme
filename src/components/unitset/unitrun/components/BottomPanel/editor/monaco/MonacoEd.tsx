"use client";
import Typography from "@mui/material/Typography";
import "./MonacoEditor.css";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import MonacoCommonEd from "./MonacoCommonEd";
import unit from "@/components/unitset/unitrun/layers/store/unit";

const MonacoEd = observer((props: any) => {
  const { monacoid, autolayout } = props;
  return (
    <Box
      key={`MonacoEd${monacoid}`}
      className="watchmonaco"
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: autolayout ? "auto" : "99%",
        padding: "10px",
      }}
    >
      {unit.editors[0].info && (
        <Typography sx={{ textAlign: "center", color: "#618B4E" }}>
          {unit.editors[0].info}
        </Typography>
      )}
      {unit.editors[0].errorMessage && !unit.editors[0].editordisabled && (
        <Typography sx={{ textAlign: "center", color: "#FF5549" }}>
          {unit.editors[0].errorMessage}
        </Typography>
      )}
      <MonacoCommonEd {...props} />
    </Box>
  );
});

export default MonacoEd;
