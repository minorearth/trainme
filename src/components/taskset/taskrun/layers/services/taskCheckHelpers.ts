import { L } from "tpconst/lang";

import { eqArrays } from "tpconst/utils";
import { Task } from "tpconst/T";

const cleanUpCode = (code: string) => {
  const lines = code.match(/[^\r\n]+/g) ?? [];
  const res = lines
    .map((line) => line.replaceAll(/#.*/g, ""))
    .map((line) => line.replaceAll(/[\n\t]/g, ""))
    .filter((line) => line != "");
  return res;
};

interface CheckLines {
  code: string;
  maxlines: number;
}
// [[].*for.*in.*[]]
const checkLines = ({ code, maxlines }: CheckLines) => {
  const codeLines = cleanUpCode(code);
  return maxlines >= codeLines.length;
};

interface CheckMustHave {
  code: string;
  musthave: string[];
  musthaveRe: string[];
}

const checkMustHave = ({ code, musthave, musthaveRe }: CheckMustHave) => {
  const codeLines = cleanUpCode(code).join("\n");

  // const musthaveCheck = musthave
  //   .map((item) => codeLines.includes(item))
  //   .every(Boolean);
  const musthaveReCheck = musthaveRe
    .map((item) => {
      const regex = new RegExp(item.slice(1, -1), "g");
      return codeLines.match(regex) != null;
    })
    .every(Boolean);
  return musthaveReCheck;
};

interface checkForbidden {
  code: string;
  forbidden: string[];
  forbiddenRe: string[];
}

const checkForbidden = ({ code, forbidden, forbiddenRe }: checkForbidden) => {
  const codeLines = cleanUpCode(code).join("\n");
  // const forbiddenCheck1 = forbidden.map((item) => !codeLines.includes(item));
  // const forbiddenCheck = forbiddenCheck1.every(Boolean);
  const forbiddenReCheck1 = forbiddenRe.map((item) => {
    const regex = new RegExp(item.slice(1, -1), "g");
    console.log("regex", regex, codeLines.match(regex));

    return codeLines.match(regex) == null;
  });
  const forbiddenReCheck = forbiddenReCheck1.every(Boolean);
  return forbiddenReCheck;
};

interface CheckCode {
  code: string;
  task: Task;
  runPythonCode: ({
    code,
    stdIn,
  }: {
    code: string;
    stdIn: string;
  }) => Promise<{ outputTxt: string; outputArr: string[] }>;
}

const checkCode = async ({ code, task, runPythonCode }: CheckCode) => {
  const results = await Promise.all(
    task.inout.map(async (check) => {
      const { outputArr } = await runPythonCode({
        code: check.filesdata.join("\n") + code,
        stdIn: check.inv.join("\n"),
      });
      return eqArrays(outputArr, check.outv);
    })
  );
  return results.every(Boolean);
};

export const runCheckers = async ({ code, task, runPythonCode }: CheckCode) => {
  const codeChecked = await checkCode({ code, task, runPythonCode });
  const linesChecked = checkLines({
    code,
    maxlines: task.restrictions.maxlines,
  });
  const mustHaveChecked = checkMustHave({
    code,
    musthave: task.restrictions.musthave,
    musthaveRe: task.restrictions.musthaveRe,
  });
  const forbiddenChecked = checkForbidden({
    code,
    forbidden: task.restrictions.forbidden,
    forbiddenRe: task.restrictions.forbiddenRe,
  });
  return { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked };
};

interface GetErrorMessage {
  codeChecked: boolean;
  linesChecked: boolean;
  mustHaveChecked: boolean;
  forbiddenChecked: boolean;
}
export const getErrorMessage = ({
  codeChecked,
  linesChecked,
  mustHaveChecked,
  forbiddenChecked,
}: GetErrorMessage) => {
  const intro = L.ru.CE.CODE_ERROR_INTRO;
  const errorList = [];
  !codeChecked && errorList.push(`☹️ ${L.ru.CE.error4}\n`);
  !mustHaveChecked && errorList.push(`😢 ${L.ru.CE.error1}\n`);
  !linesChecked && errorList.push(`🫤 ${L.ru.CE.error2}\n\n`);
  !forbiddenChecked && errorList.push(`🫢 ${L.ru.CE.error6}`);

  let errorMsg = "";
  if (errorList.length != 0) {
    errorList.push(L.ru.CE.CODE_ERROR_FOOTER);

    errorMsg = intro + errorList.join("");
  }

  switch (true) {
    case errorMsg != "":
      return errorMsg;
    case [
      codeChecked && linesChecked && mustHaveChecked && forbiddenChecked,
    ].every(Boolean):
      return "";
    default:
      return "some error in default";
  }
};

//TODO: (later) game
// https://www.taniarascia.com/sokoban-game/
// https://www.taniarascia.com/sokoban-game/
