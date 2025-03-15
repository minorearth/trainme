"use client";
import ChampUsers from "./components/ChampUsersGrid/ChampUsers";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import useChamps from "./champVC";
import Input from "@mui/material/Input";
import { useState } from "react";

const Champ = observer(({ actions, appState }) => {
  const {
    rows,
    setRowsx,
    createChamp,
    joinChamp,
    changeChampid,
    chapmid,
    startChamp,
    changeUserName,
    userName,
  } = useChamps({ actions, appState });

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
        <Button onClick={() => startChamp(chapmid)}>Начать</Button>

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
            width: "70px",
          }}
        />

        <Input
          id="standard-multiline-flexible"
          height="100%"
          disableUnderline
          onChange={(e) => changeUserName(e)}
          value={userName}
          sx={{
            display: "inline-block",
            whiteSpace: "pre-wrap",
            backgroundColor: "ButtonShadow",
            width: "100px",
          }}
        />
      </Box>
      <ChampUsers rows={rows} />
    </Box>
  );
});

export default Champ;
