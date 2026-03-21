"use client";
// import "./MonacoEditor.css";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import MonacoCommonEd from "./MonacoCommonEditor/MonacoCommonEd";

const MonacoEd = observer((props: any) => {
  const { monacoid, autolayout } = props;
  return (
    // <Box
    //   key={`MonacoEd${monacoid}`}
    //   className="watchmonaco"
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     width: "100%",
    //     // height: autolayout ? "auto" : "99%",
    //     padding: "10px",
    //   }}
    // >
    <MonacoCommonEd {...props} />
    // </Box>
  );
});

export default MonacoEd;
