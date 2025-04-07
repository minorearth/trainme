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
import StepByStep from "@/components/champ/components/Stepper";

const Champ = observer(({ actionsNAV, appState }) => {
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
    changeTaskCount,
    taskCount,
    range,
  } = useChamps({ actionsNAV, appState });
  const [activeStep, setActiveStep] = useState(0);
  const [creator, setCreator] = useState();

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
            <Button
              sx={{ width: "30%" }}
              onClick={() => {
                setActiveStep(1);
              }}
              disabled={!userName}
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
                setCreator(true);
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
                setCreator(false);
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
        {activeStep === 2 && creator && (
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
              onChange={(e) => changeTaskCount(e)}
              value={taskCount}
              width="30%"
            />

            <Button
              disabled={!taskCount}
              onClick={() => {
                createChamp();
                setActiveStep(2);
                setCreator(true);
              }}
              variant="outlined"
              fullWidth
            >
              Создать чемпионат
            </Button>

            {champNumber && (
              <Typography variant="h4" gutterBottom>
                {champid}
              </Typography>
            )}
            <Button
              disabled={!champNumber}
              onClick={() => startChamp(champid)}
              variant="outlined"
              fullWidth
            >
              Начать
            </Button>
            <Button
              disabled={!champNumber}
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
        {!creator && activeStep === 2 && (
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
              onChange={(e) => changeChampNumber(e)}
              value={champNumber}
              fullWidth
            />

            <Button
              disabled={!champNumber}
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
        {/* <Button
          sx={{ marginTop: "40px", width: "30%", alignSelf: "center" }}
          variant="outlined"
          fullWidth
          onClick={() => actionsNAV.openAllCoursePage()}
        >
          Выйти
        </Button> */}
      </Box>
      {champNumber && (
        <Box
          sx={{
            display: "flex",
            // flex: 1,
            overflow: "auto",
            width: "70%",
            flexDirection: "column",
            alignItems: "center",
            // border: "1px solid",
            // borderRadius: "5px",
            // margin: "20px",
          }}
        >
          <SortableList champid={champNumber} />
        </Box>
      )}
    </Box>
  );
});

export default Champ;
