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

const checkMustHave = (code, musthave, musthaveRe) => {
  const codeLines = cleanUpCode(code).join();
  const musthaveCheck = musthave
    .map((item) => codeLines.includes(item))
    .every(Boolean);
  const musthaveReCheck = musthaveRe
    .map((item) => {
      const regex = new RegExp(item, "g");
      return codeLines.match(regex) != null;
    })
    .every(Boolean);
  return musthaveCheck && musthaveReCheck;
};

const checkForbidden = (code, musthave, musthaveRe) => {
  const codeLines = cleanUpCode(code).join();
  const forbiddenCheck1 = musthave.map((item) => !codeLines.includes(item));
  const forbiddenCheck = forbiddenCheck1.every(Boolean);
  console.log(forbiddenCheck1, forbiddenCheck, musthave, musthaveRe, code);

  const forbiddenReCheck1 = musthaveRe.map((item) => {
    const regex = new RegExp(item, "g");
    console.log(
      regex,
      codeLines,
      codeLines.match(regex),
      codeLines.match(regex) == null
    );

    return codeLines.match(regex) == null;
  });
  const forbiddenReCheck = forbiddenReCheck1.every(Boolean);

  return forbiddenCheck && forbiddenReCheck;
};

// const message = "[[].*for.*in.*]"; // Try edit me
// s = 's="[i for i in range(10)]"';
// const regex = new RegExp(message, "g");
// console.log(s.match(regex));

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
  const mustHaveChecked = checkMustHave(
    code,
    test.restrictions.musthave,
    test.restrictions.musthaveRe
  );
  const forbiddenChecked = checkForbidden(
    code,
    test.restrictions.forbidden,
    test.restrictions.forbiddenRe
  );
  return { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked };
};

export const getErrorMessage = (
  codeChecked,
  linesChecked,
  mustHaveChecked,
  forbiddenChecked
) => {
  const intro = "Ты допустил следующие ошибки: ";
  const errorList = [];
  // console.log(codeChecked, linesChecked, mustHaveChecked);
  !codeChecked && errorList.push(stn.errors.error4);
  !mustHaveChecked && errorList.push(stn.errors.error1);
  !linesChecked && errorList.push(stn.errors.error2);
  !forbiddenChecked && errorList.push(stn.errors.error6);
  const errorMsg = intro + errorList.join(", ");

  switch (true) {
    case errorMsg != "":
      return errorMsg;
    case [
      codeChecked && linesChecked && mustHaveChecked && forbiddenChecked,
    ].every(Boolean):
      return "";
  }
};

// export const getErrorMessage = (
//   codeChecked,
//   linesChecked,
//   mustHaveChecked,
//   forbiddenChecked
// ) => {
//   console.log(codeChecked, linesChecked, mustHaveChecked);
//   switch (true) {
//     case [!mustHaveChecked, codeChecked, linesChecked].every(Boolean):
//       return stn.errors.error1;
//     case [mustHaveChecked, codeChecked, !linesChecked].every(Boolean):
//       return stn.errors.error2;
//     case [!mustHaveChecked, codeChecked, !linesChecked].every(Boolean):
//       return stn.errors.error3;
//     case [!codeChecked].every(Boolean):
//       return stn.errors.error4;
//     case [codeChecked && linesChecked && mustHaveChecked].every(Boolean):
//       return "";
//   }
// };
