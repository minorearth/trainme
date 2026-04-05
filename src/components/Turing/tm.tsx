import React, { useState, useMemo, ChangeEvent, useEffect } from "react";
import { runTM } from "./turing";
import { Button, Typography } from "@mui/material";

type CellValue = [string, string, number | string];
type TableData = { [state: number]: { [char: string]: string } };
type ReactunTimeState = {};

// const program = {
//   _: [
//     ["_", "L", 1],
//     ["0", "S", 1],
//   ],
//   0: [[], ["1", "L", 1]],
//   1: [[], ["0", "S", 1]],
// };

const TAPE_DEFAULT = "_10001_";

const TuringMachineEditor: React.FC = () => {
  // const [alphabetInput, setAlphabetInput] = useState<string>(`\u03BB01`);
  const [alphabetInput, setAlphabetInput] = useState<string>(`_01`);

  const [numStates, setNumStates] = useState<number>(2);
  const [tableData, setTableData] = useState<TableData>({
    0: { _: "_R1" },
    1: { 0: "1R1", 1: "0R1", _: "_S1" },
  });
  const [tape, setTape] = useState<string>(TAPE_DEFAULT);
  const [pointer, setPointer] = useState<number>(0);
  const [state, setState] = useState<number>(0);

  const [runTimeState, setRunTimeState] = useState<ReactunTimeState>();

  const [resTape, setResTape] = useState<string>(TAPE_DEFAULT);
  const [tapeDisplay, setTapeDisplay] = useState<string>(TAPE_DEFAULT);

  const [resState, setResState] = useState<number>(0);
  const [resPointer, setResPointer] = useState<number>(0);
  const [programIsFinished, setProgramIsFinished] = useState<boolean>(false);
  const [resChar, setChar] = useState<string>("");

  const alphabet = useMemo(
    () => alphabetInput.split("").filter((s) => s !== " "),
    [alphabetInput],
  );

  useEffect(() => {
    // setResPointer(pointer);
    // setResTape(tape);
    // setResState(0);
    setTapeDisplay(selectSym(tape, pointer));
    // setProgramIsFinished(false);
    setChar(tape[pointer]);
    // setRunTimeState({
    // })
  }, []);

  const handleCellChange = (state: number, char: string, value: string) => {
    setTableData((prev) => ({
      ...prev,
      [state]: { ...prev[state], [char]: value },
    }));
  };

  const selectSym = (line: string, pos: number) => {
    const left = line.slice(0, pos);
    const sym = line.slice(pos, pos + 1);
    const right = line.slice(pos + 1);
    return (
      left +
      '<span style="border: 1px solid black; padding: 0 2px;">' +
      sym +
      "</span>" +
      right
    );
  };

  const resetProgram = () => {
    setResPointer(pointer);
    setResTape(tape);
    setResState(0);
    setTapeDisplay(selectSym(tape, pointer));
    setProgramIsFinished(false);
    setChar(tape[pointer]);
  };

  const program = useMemo(() => {
    const prog: { [char: string]: any[] } = {};

    alphabet.forEach((char) => {
      prog[char] = [];
      for (let s = 0; s < numStates; s++) {
        const val = tableData[s]?.[char] || "";
        const parts = val.split("").map((p) => p.trim());

        if (parts.length === 3) {
          prog[char][s] = [
            parts[0],
            parts[1],
            isNaN(Number(parts[2])) ? parts[2] : Number(parts[2]),
          ];
        } else {
          prog[char][s] = [];
        }
      }
    });
    return prog;
  }, [alphabet, numStates, tableData]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <label>Лента: </label>
        <br />

        <input
          value={tape}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setTape(e.target.value);
            setResTape(e.target.value);
            setTapeDisplay(selectSym(e.target.value, pointer));
          }}
        />
        <br />
        <label>Алфавит: </label>
        <br />

        <input
          value={alphabetInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAlphabetInput(e.target.value)
          }
        />
        <br />
        <label>Кол-во состояний: </label>
        <br />

        <input
          type="number"
          value={numStates}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNumStates(Math.max(1, parseInt(e.target.value) || 0))
          }
        />
        <br />
        <label>Начальное положение каретки</label>
        <br />

        <input
          type="number"
          value={pointer}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const val = Math.min(
              Math.max(0, parseInt(e.target.value) || 0),
              tape.length - 1,
            );
            setPointer(val);
            setResPointer(val);
            setTapeDisplay(selectSym(tape, val));
          }}
        />
      </div>

      <table
        border={1}
        style={{ borderCollapse: "collapse", marginBottom: "20px" }}
      >
        <thead>
          <tr>
            <th></th>
            {alphabet.map((char) => (
              <th key={char} style={{ padding: "10px" }}>
                {char}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: numStates }).map((_, s) => (
            <tr key={s}>
              <td style={{ fontWeight: "bold", padding: "10px" }}>q{s}</td>
              {alphabet.map((char) => (
                <td
                  key={char}
                  style={{
                    backgroundColor:
                      char == resChar && s == resState
                        ? "#cce8cc"
                        : "transparent",
                    // color: "white",
                  }}
                >
                  <input
                    style={{
                      width: "100px",
                      textAlign: "center",
                      border: "none",
                      outline: "none",
                      backgroundColor:
                        char == resChar && s == resState
                          ? "#cce8cc"
                          : "transparent",
                    }}
                    value={tableData[s]?.[char] || ""}
                    onChange={(e) => handleCellChange(s, char, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        disabled={programIsFinished}
        onClick={() => {
          const { resPointer2, resTape2, resState2, resChar } = runTM({
            tape: resTape.split(""),
            program,
            pointer: resPointer,
            state: resState,
          }) as any;
          setResPointer(resPointer2);
          setResTape(resTape2);
          setResState(resState2);
          setTapeDisplay(selectSym(resTape2, resPointer2));
          setChar(resChar);
          if (resState2 == -1) setProgramIsFinished(true);
          // resetProgram();
        }}
      >
        run
      </Button>

      <Button
        onClick={() => {
          resetProgram();
        }}
      >
        reset
      </Button>

      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: `${tapeDisplay}`,
        }}
        sx={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
          width: "100%",
        }}
      ></Typography>
    </div>
  );
};

export default TuringMachineEditor;

<p>Hello</p>;
