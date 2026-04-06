export const runTM = ({ tape, program, pointer, state }) => {
  let char = tape[pointer];
  if (
    !program[char] ||
    !program[char][state] ||
    program[char][state].length === 0
  ) {
    return {
      resPointer2: pointer,
      resTape2: tape.join(""),
      resState2: -2,
      resChar: tape[pointer],
    };
  }

  const [newChar, move, nextState] = program[char][state];
  tape[pointer] = newChar;
  state = nextState;
  if (move === "L") {
    pointer--;
  } else if (move === "R") {
    pointer++;
  } else if (move === "S") {
    return {
      resPointer2: pointer,
      resTape2: tape.join(""),
      resState2: -1,
      resChar: tape[pointer],
    };
  }

  if (pointer < 0 || pointer >= tape.length)
    return {
      resPointer2: pointer,
      resTape2: tape.join(""),
      resState2: -2,
      resChar: "",
    };

  return {
    resPointer2: pointer,
    resTape2: tape.join(""),
    resState2: state,
    resChar: tape[pointer],
  };
};
