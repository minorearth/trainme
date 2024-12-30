import { stn } from "@/constants";

const eqArrays = (a, b) => {
  return a.every((val, idx) => val === b[idx]);
};

const cleanUpCode = (code) => {
  const codeLines = code
    .split("\n")
    .map((line) => line.replace(/#.*/g, "").replace(/[\n\t ]/g, ""))
    .filter((line) => line != "");
  return codeLines;
};

// [[].*for.*in.*[]]
const checkLines = (code, maxlines) => {
  const codeLines = cleanUpCode(code);
  return maxlines >= codeLines.length;
};

const checkMustHave = (code, musthave) => {
  const codeLines = cleanUpCode(code).join();
  return musthave.map((item) => codeLines.includes(item)).every(Boolean);
};

const checkCode = async (code, test, runPythonCode) => {
  const results = await Promise.all(
    test.inout.map(async (check) => {
      const output = await runPythonCode(code, check.inv.join("\n"));
      return eqArrays(output, check.outv);
    })
  );
  return results.every(Boolean);
};

export const runCheckers = async (code, test, runPythonCode) => {
  const codeChecked = await checkCode(code, test, runPythonCode);
  const linesChecked = checkLines(code, test.restrictions.maxlines);
  const mustHaveChecked = checkMustHave(code, test.restrictions.musthave);
  return { codeChecked, linesChecked, mustHaveChecked };
};

export const getErrorMessage = (codeChecked, linesChecked, mustHaveChecked) => {
  switch (true) {
    case [!mustHaveChecked, codeChecked, linesChecked].every(Boolean):
      return stn.errors.error1;
    case [mustHaveChecked, codeChecked, !linesChecked].every(Boolean):
      return stn.errors.error2;
    case [!mustHaveChecked, codeChecked, !linesChecked].every(Boolean):
      return stn.errors.error3;
    case [!codeChecked].every(Boolean):
      return stn.errors.error4;
    case [codeChecked && linesChecked && mustHaveChecked].every(Boolean):
      return "";
  }
};
