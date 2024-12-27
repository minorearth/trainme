"use client";
import { useState, useEffect, useRef } from "react";
import { stn } from "@/constants";
import { chapters } from "@/app/data";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { persistState, loadStatePersisted } from "@/app/db/localstorage";

export default function Chapters({ setTestsStarted }) {
  const setChapterAndTestsStarted = (chapter) => {
    setTestsStarted(chapter);
  };

  useEffect(() => {
    // setTests(getTests(chapter));
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {chapters.map((chapter) => (
        <Button
          key={chapter.id}
          sx={{ width: "90%", margin: "10px" }}
          onClick={() => {
            setChapterAndTestsStarted(chapter.id);
          }}
          variant="outlined"
        >
          {chapter.name}
        </Button>
      ))}
    </Box>
  );
}
