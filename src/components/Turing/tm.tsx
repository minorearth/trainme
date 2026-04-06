import React, { ChangeEvent } from "react";
import {
  Button,
  Typography,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import useTM from "./useTM";
import { stat } from "fs";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const TuringMachineEditor: React.FC = () => {
  const { actions, state } = useTM();

  return (
    <Box sx={{ p: 4, maxWidth: "1200px", margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Эмулятор машины Тьюринга
      </Typography>

      {/* Панель настроек */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        {/* <Typography variant="h6" sx={{ mb: 2 }}>
          Настройки
        </Typography> */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
          gap={3}
        >
          <TextField
            label="Лента"
            variant="outlined"
            size="small"
            value={state.setup.tape}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              actions.handleTapeChange(e)
            }
          />
          <TextField
            label="Алфавит"
            variant="outlined"
            size="small"
            value={state.setup.alphabetInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              actions.setAlphabetInput(e.target.value)
            }
          />
          {/* <TextField
            label="Кол-во состояний"
            type="number"
            variant="outlined"
            size="small"
            value={state.setup.numStates}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              actions.handleNumStatesChange(e)
            }
          /> */}
          {/* <TextField
            label="Начало каретки"
            type="number"
            variant="outlined"
            size="small"
            value={state.setup.pointer}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              actions.handlePointerChange(e.target.value)
            }
          /> */}
        </Box>
      </Paper>

      {/* Таблица переходов */}
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ mb: 4, borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "120px" }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Сост.
                  </Typography>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newVal = Math.max(1, state.setup.numStates - 1);
                        actions.handleNumStatesChange({
                          target: { value: newVal },
                        } as any);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      <RemoveIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        const newVal = state.setup.numStates + 1;
                        actions.handleNumStatesChange({
                          target: { value: newVal },
                        } as any);
                      }}
                      sx={{ p: 0.5 }}
                    >
                      <AddIcon fontSize="inherit" />
                    </IconButton>
                  </Stack>
                </Stack>
              </TableCell>
              {state.setup.alphabet.map((char) => (
                <TableCell
                  key={char}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  {char === " " ? "␣" : char}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: state.setup.numStates }).map((_, s) => (
              <TableRow key={s} hover>
                <TableCell
                  sx={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
                >
                  q<sub>{s}</sub>
                </TableCell>
                {state.setup.alphabet.map((char) => {
                  const isCurrent =
                    char === state.runtime.resChar &&
                    s === state.runtime.resState;
                  return (
                    <TableCell
                      key={char}
                      sx={{
                        p: 0,
                        backgroundColor: isCurrent ? "#e8f5e9" : "inherit",
                        transition: "background-color 0.3s",
                      }}
                    >
                      <input
                        style={{
                          width: "100%",
                          padding: "12px 8px",
                          textAlign: "center",
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          fontFamily: "monospace",
                          fontSize: "14px",
                        }}
                        placeholder="сим, напр, сост"
                        value={state.setup.tableData[s]?.[char] || ""}
                        onChange={(e) =>
                          actions.handleCellChange(s, char, e.target.value)
                        }
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Управление и Визуализация */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          textAlign: "center",
          backgroundColor: "#1e1e1e",
          color: "#fff",
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: "#aaa", mb: 1, display: "block" }}
        >
          Состояние ленты
        </Typography>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          {/* Кнопка Влево */}
          <IconButton
            sx={{
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
            onClick={() =>
              actions.handlePointerChange((state.setup.pointer - 1).toString())
            }
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              dangerouslySetInnerHTML={{ __html: state.runtime.tapeDisplay }}
              sx={{
                fontFamily: "'Courier New', Courier, monospace",
                letterSpacing: "4px",
                wordBreak: "break-all",
                "& span": {
                  backgroundColor: "#2e7d32",
                  padding: "2px 6px",
                  borderRadius: "4px",
                },
              }}
            />
          </Box>

          {/* Кнопка Вправо */}
          <IconButton
            sx={{
              color: "#fff",
              "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
            }}
            onClick={() =>
              actions.handlePointerChange((state.setup.pointer + 1).toString())
            }
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 2, borderColor: "#444" }} />

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayArrowIcon />}
            disabled={state.runtime.programIsFinished}
            onClick={() => actions.runProgram()}
            sx={{ px: 4 }}
          >
            Запустить
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltIcon />}
            onClick={() => actions.resetProgram()}
          >
            Сбросить
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TuringMachineEditor;
