"use client";
import ChampUsers from "./ChampUsersGrid/ChampUsers";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import useChamps from "./champVC";
import Input from "@mui/material/Input";
import { useState } from "react";

const Champ = observer(({ mode }) => {
  const { rows, setRowsx, createChamp, joinChamp, changeChampid, chapmid } =
    useChamps({});

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        overflow: "auto",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "auto",
          width: "100%",
          flexDirection: "row",
        }}
      >
        <Button onClick={() => createChamp()}> Создать чамп</Button>
        <Button onClick={() => joinChamp(chapmid)}> Присоединиться</Button>
        <Input
          id="standard-multiline-flexible"
          height="100%"
          disableUnderline
          onChange={(e) => changeChampid(e)}
          value={chapmid}
          sx={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
            backgroundColor: "ButtonShadow",
            width: "50px",
          }}
        />
      </Box>
      <ChampUsers rows={rows} mode={mode} />
    </Box>
  );
});

export default Champ;
