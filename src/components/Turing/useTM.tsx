import React, { useState, useMemo, ChangeEvent, useEffect } from "react";
import { runTM } from "./turing";
import { Button, Typography } from "@mui/material";

type TableData = { [state: number]: { [char: string]: string } };

// const program = {
//   _: [
//     ["_", "L", 1],
//     ["0", "S", 1],
//   ],
//   0: [[], ["1", "L", 1]],
//   1: [[], ["0", "S", 1]],
// };

export interface UseTM {
  actions: {
    resetProgram: () => void;
    handleTapeChange: (e: ChangeEvent<HTMLInputElement>) => void;
    setAlphabetInput: (value: string) => void;
    handleNumStatesChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handlePointerChange: (val: string) => void;
    handleCellChange: (state: number, char: string, value: string) => void;
    runProgram: () => void;
  };
  state: {
    setup: {
      tape: string;
      alphabetInput: string;
      numStates: number;
      pointer: number;
      alphabet: string[];
      tableData: TableData;
    };
    runtime: {
      resChar: string;
      resState: number;
      programIsFinished: boolean;
      tapeDisplay: string;
    };
  };
}
const TAPE_DEFAULT = "_10001_";

const useTM = () => {
  //setup
  const [tape, setTape] = useState<string>(TAPE_DEFAULT);
  const [alphabetInput, setAlphabetInput] = useState<string>(`_01`);
  const [numStates, setNumStates] = useState<number>(2);

  const [tableData, setTableData] = useState<TableData>({
    0: { _: "_R1" },
    1: { 0: "1R1", 1: "0R1", _: "_S1" },
  });
  const [pointer, setPointer] = useState<number>(0);

  //runtime

  const [resChar, setResChar] = useState<string>("");
  const [resState, setResState] = useState<number>(0);
  const [resTape, setResTape] = useState<string>(TAPE_DEFAULT);
  const [resPointer, setResPointer] = useState<number>(0);
  const [tapeDisplay, setTapeDisplay] = useState<string>(TAPE_DEFAULT);
  const [programIsFinished, setProgramIsFinished] = useState<boolean>(false);

  const alphabet = useMemo(
    () => alphabetInput.split("").filter((s) => s !== " "),
    [alphabetInput],
  );

  useEffect(() => {
    setTapeDisplay(selectSym(tape, pointer));
    setResChar(tape[pointer]);
  }, []);

  const handleCellChange = (state: number, char: string, value: string) => {
    setTableData((prev) => ({
      ...prev,
      [state]: { ...prev[state], [char]: value },
    }));
  };

  const handleTapeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTapValue = e.target.value;
    const newPointer = Math.min(pointer, newTapValue.length - 1);
    changePointer(newPointer.toString());
    setTape(newTapValue);
    setResTape(newTapValue);
    setTapeDisplay(selectSym(newTapValue, newPointer));
  };

  const handleNumStatesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNumStates(Math.max(1, parseInt(e.target.value) || 0));
  };

  const changePointer = (val: string) => {
    const valParsed = Math.min(
      Math.max(0, parseInt(val) || 0),
      tape.length - 1,
    );
    setPointer(valParsed);
    setResPointer(valParsed);
    setTapeDisplay(selectSym(resTape, valParsed));
    setResChar(resTape[valParsed]);
  };

  const handlePointerChange = (val: string) => {
    changePointer(val);
  };

  const runProgram = () => {
    {
      const { resPointer2, resTape2, resState2, resChar } = runTM({
        tape: resTape.split(""),
        program,
        pointer: resPointer,
        state: resState,
      }) as any;
      if (resState2 == -2) return;

      setResPointer(resPointer2);
      setPointer(resPointer2);
      setResTape(resTape2);
      setResState(resState2);
      setTapeDisplay(selectSym(resTape2, resPointer2));
      setResChar(resChar);
      if (resState2 == -1) setProgramIsFinished(true);
      // resetProgram();
    }
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
    setResChar(tape[pointer]);
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

  return {
    actions: {
      resetProgram,
      handleCellChange,
      handleTapeChange,
      setAlphabetInput,
      handleNumStatesChange,
      handlePointerChange,
      runProgram,
    },
    state: {
      setup: { tape, alphabetInput, numStates, pointer, alphabet, tableData },
      runtime: { resChar, resState, programIsFinished, tapeDisplay },
    },
  } as UseTM;
};

export default useTM;

// const [alphabetInput, setAlphabetInput] = useState<string>(`\u03BB01`);
