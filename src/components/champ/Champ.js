"use client";
import ChampUsers from "./components/ChampUsersGrid/ChampUsers";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import useChamps from "./champVC";
import Input from "@mui/material/Input";
import { useState } from "react";
import { Panel } from "./components/Panel";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import RangeSlider from "./components/RangeSlider";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";

const Champ = observer(({ actions, appState }) => {
  const {
    createChamp,
    joinChamp,
    champid,
    startChamp,
    changeUserName,
    userName,
    champNumber,
    changeChampNumber,
    changeRange,
    range,
  } = useChamps({ actions, appState });

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        overflow: "auto",
        width: "100%",
        flexDirection: "row",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          width: "30%",
          flexDirection: "column",
          margin: "10px",
        }}
      >
        <Panel label={"Создать чемпионат"}>
          <Box
            sx={{
              display: "flex",
              // flex: 1,
              overflow: "auto",
              width: "70%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {!champid && <Typography gutterBottom>Сложность</Typography>}
            {!champid && (
              <RangeSlider changeRange={changeRange} range={range} />
            )}

            <Button
              sx={{ marginBottom: "40px" }}
              onClick={() => createChamp()}
              variant="outlined"
              fullWidth
            >
              Создать чемпионат
            </Button>
            {champid && (
              <Typography variant="h4" gutterBottom>
                {champid}
              </Typography>
            )}
            {champid && (
              <Button
                onClick={() => startChamp(champid)}
                variant="outlined"
                fullWidth
              >
                Начать
              </Button>
            )}
            {/* </Box> */}
            {/* </Panel> */}
            {/* <Panel label={"Результаты"}> */}
            {/* <Box
            sx={{
              display: "flex",
              // flex: 1,
              overflow: "auto",
              width: "70%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              padding: "10px",
            }}
          > */}
            {/* <TextField
              id="outlined-basic"
              label="Номер чемпионата"
              variant="outlined"
              onChange={(e) => changeChampNumber(e)}
              value={champNumber}
              fullWidth
            /> */}
            {champid && (
              <Button
                sx={{ marginBottom: "40px" }}
                variant="outlined"
                fullWidth
                onClick={() =>
                  window.open(
                    `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/${champid}`,
                    "_blank"
                  )
                }
              >
                В новом окне
              </Button>
            )}
            {/* </Panel> */}
            {/* <Panel label={"Присоединиться"}> */}
            {/* <Box
            sx={{
              display: "flex",
              // flex: 1,
              overflow: "auto",
              width: "70%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              padding: "10px",
            }}
          > */}
            <TextField
              id="outlined-basic"
              label="Введите имя"
              defaultValue={"Рандомное имя"}
              variant="outlined"
              onChange={(e) => changeUserName(e)}
              value={userName}
              fullWidth
            />
            <TextField
              id="outlined-basic"
              label="Номер чемпионата"
              variant="outlined"
              onChange={(e) => changeChampNumber(e)}
              value={champNumber}
              fullWidth
            />

            <Button
              sx={{ marginBottom: "40px" }}
              disabled={!userName || !champNumber}
              variant="outlined"
              onClick={() => joinChamp()}
              fullWidth
            >
              {" "}
              Присоединиться
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => actions.openAllCoursePage()}
            >
              Выйти
            </Button>
          </Box>
        </Panel>
      </Box>
      <Box
        sx={{
          display: "flex",
          // flex: 1,
          overflow: "auto",
          width: "70%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <SortableList champid={champNumber} />
        {/* <ChampUsers champid={champNumber} /> */}
      </Box>
    </Box>
  );
});

export default Champ;
