import { stn } from "@/constants";

const eqArrays = (a, b) => {
  return (
    a.every((val, idx) => val === b[idx]) &&
    b.every((val, idx) => val === a[idx])
  );
};

const cleanUpCode = (code) => {
  return code
    .match(/[^\r\n]+/g)
    .map((line) => line.replaceAll(/#.*/g, ""))
    .map((line) => line.replaceAll(/[\n\t]/g, ""))
    .filter((line) => line != "");
};

// [[].*for.*in.*[]]
const checkLines = (code, maxlines) => {
  const codeLines = cleanUpCode(code);
  return maxlines >= codeLines.length;
};

const checkMustHave = (code, musthave, musthaveRe) => {
  const codeLines = cleanUpCode(code).join("\n");

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
  const codeLines = cleanUpCode(code).join("\n");
  const forbiddenCheck1 = musthave.map((item) => !codeLines.includes(item));
  const forbiddenCheck = forbiddenCheck1.every(Boolean);

  const forbiddenReCheck1 = musthaveRe.map((item) => {
    const regex = new RegExp(item, "g");

    return codeLines.match(regex) == null;
  });
  const forbiddenReCheck = forbiddenReCheck1.every(Boolean);

  return forbiddenCheck && forbiddenReCheck;
};

const checkCode = async (code, test, runPythonCode) => {
  const results = await Promise.all(
    test.inout.map(async (check) => {
      const { outputArr } = await runPythonCode(code, check.inv.join("\n"));
      return eqArrays(outputArr, check.outv);
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
  const intro = "Ты допустил следующие ошибки:\n\n ";
  const errorList = [];
  !codeChecked && errorList.push(`☹️ ${stn.errors.error4}\n`);
  !mustHaveChecked && errorList.push(`😢 ${stn.errors.error1}\n`);
  !linesChecked && errorList.push(`🫤 ${stn.errors.error2}\n\n`);
  !forbiddenChecked && errorList.push(`🫢 ${stn.errors.error6}`);

  let errorMsg = "";
  if (errorList.length != 0) {
    errorList.push(`\n\nСмотри верный код в окне редактора!`);

    errorMsg = intro + errorList.join("");
  }

  switch (true) {
    case errorMsg != "":
      return errorMsg;
    case [
      codeChecked && linesChecked && mustHaveChecked && forbiddenChecked,
    ].every(Boolean):
      return "";
  }
};
