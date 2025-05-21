"use client";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Button } from "@mui/material";
import useChamps from "./champVC";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import RangeSlider from "./components/RangeSlider";
import SortableList from "@/components/champ/components/ChampUsersList/ChampUsersList";
import StepByStep from "@/components/champ/components/Stepper";
import AvatarSelector from "@/components/champ/components/avatar/avatar";

const Champ = observer(({ actionsNAV, appState }) => {
  const {
    createChamp,
    joinChamp,
    champid,
    startChamp,
    changeUserName,
    userName,
    inputChampId,
    changeInputChampId,
    changeRange,
    changeTaskCount,
    taskCount,
    range,
    setAvatarid,
    avatarid,
    nameChecked,
  } = useChamps({ actionsNAV, appState });
  const [activeStep, setActiveStep] = useState(0);
  const [createMode, setCreateMode] = useState();

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        overflow: "auto",
        width: "100%",
        flexDirection: "row",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          overflow: "auto",
          width: "30%",
          flexDirection: "column",
          margin: "10px",
          padding: "40px",
          justifyContent: "center",
        }}
      >
        <StepByStep activeStep={activeStep} setActiveStep={setActiveStep} />
        {activeStep === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Введите имя"
              variant="outlined"
              onChange={(e) => changeUserName(e)}
              value={userName}
              fullWidth
            />
            <AvatarSelector
              currentIndex={avatarid}
              setCurrentIndex={setAvatarid}
            />

            <Button
              sx={{ width: "30%" }}
              onClick={() => {
                setActiveStep(1);
              }}
              disabled={!nameChecked}
              variant="outlined"
              fullWidth
            >
              Дальше
            </Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <Button
              onClick={() => {
                setActiveStep(2);
                setCreateMode(true);
              }}
              variant="outlined"
              fullWidth
            >
              Создать чемпионат
            </Button>

            <Button
              sx={{ marginBottom: "10px" }}
              variant="outlined"
              onClick={() => {
                setActiveStep(2);
                setCreateMode(false);
              }}
              fullWidth
            >
              Присоединиться
            </Button>

            <Button
              sx={{ width: "30%" }}
              onClick={() => {
                setActiveStep(0);
              }}
              variant="outlined"
              // fullWidth
            >
              Назад
            </Button>
          </Box>
        )}
        {activeStep === 2 && createMode && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <>
              <Typography>Сложность</Typography>
              <RangeSlider changeRange={changeRange} range={range} />
            </>

            <TextField
              id="outlined-basic"
              label="Количество задач"
              variant="outlined"
              sx={{
                "& .MuiInputBase-input": {
                  textAlign: "center", // Центрируем текст
                  fontSize: "24px", // Увеличиваем размер шрифта
                },
              }}
              onChange={(e) => changeTaskCount(e)}
              value={taskCount}
              width="30%"
            />

            <Button
              disabled={!taskCount}
              onClick={() => {
                createChamp();
                setActiveStep(2);
                setCreateMode(true);
              }}
              variant="outlined"
              fullWidth
            >
              Создать чемпионат
            </Button>

            {champid && <Typography variant="h4">{champid}</Typography>}
            <Button
              disabled={!champid}
              onClick={() => startChamp(champid)}
              variant="outlined"
              fullWidth
            >
              Начать
            </Button>
            <Button
              disabled={!champid}
              variant="outlined"
              onClick={() => {
                joinChamp();
              }}
              fullWidth
            >
              Присоединиться
            </Button>
            <Button
              sx={{ width: "30%" }}
              onClick={() => {
                setActiveStep(1);
              }}
              variant="outlined"
              fullWidth
            >
              Назад
            </Button>
          </Box>
        )}
        {!createMode && activeStep === 2 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "30px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Номер чемпионата"
              variant="outlined"
              onChange={(e) => changeInputChampId(e)}
              value={inputChampId}
              fullWidth
            />

            <Button
              disabled={!inputChampId}
              variant="outlined"
              onClick={() => joinChamp()}
              fullWidth
            >
              Присоединиться
            </Button>
            <Button
              sx={{ width: "30%" }}
              onClick={() => {
                setActiveStep(1);
              }}
              variant="outlined"
              fullWidth
            >
              Назад
            </Button>
          </Box>
        )}
      </Box>
      {champid && (
        <Box
          sx={{
            display: "flex",
            overflow: "auto",
            width: "70%",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <SortableList champid={champid} />
        </Box>
      )}
    </Box>
  );
});

export default Champ;
