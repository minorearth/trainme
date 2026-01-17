import { L } from "tpconst/lang";

import { eqArrays } from "tpconst/utils";
import { Task } from "tpconst/T";
import { allregex } from "@/components/taskset/layers/services/allregex";
import { ast } from "@/components/taskset/taskrun/layers/services/ast";
import { E_CODES, throwInnerError } from "tpconst/errorHandlers";

const cleanUpCode = (code: string) => {
  const lines = code.match(/[^\r\n]+/g) ?? [];
  const res = lines
    .map((line) => line.replaceAll(/#.*/g, ""))
    //sep='\n' trouble
    .map((line) => line.replaceAll("\\n", "\\\\n"))
    // .map((line) => line.replaceAll(/[\n\t]/g, ""))
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

type runPythonCode = ({
  code,
  stdIn,
}: {
  code: string;
  stdIn: string;
}) => Promise<{ outputTxt: string; outputArr: string[] }>;

interface checkEntities {
  code: string;
  entities: string[];
  runPythonCode: runPythonCode;
}

const checkEntities = async ({
  code,
  entities,
  runPythonCode,
}: checkEntities) => {
  //TODO: remade
  const codeLines = cleanUpCode(code).join("\n");
  const onelinecode = cleanUpCode(code).join("\\n");
  // .replaceAll("\\\\", "\\\\\\");
  const checks = await Promise.all(
    entities.map(async (item) => {
      if (allregex[item].findmode == "regex") {
        const regex = new RegExp(allregex[item].rgx[0], "gs");
        return codeLines.match(regex) != null;
      } else {
        const { nm, param, type } = allregex[item];

        const { outputArr } = await runPythonCode({
          code: ast({ code: onelinecode, nm, param, type }),
          stdIn: "",
        });

        return outputArr[0] == "True";
      }
    })
  );
  return checks;
};

const checkForbidden = async ({
  code,
  entities,
  runPythonCode,
}: checkEntities) => {
  const checks = await checkEntities({ code, entities, runPythonCode });

  return !checks.some(Boolean);
};

const checkMustHave = async ({
  code,
  entities,
  runPythonCode,
}: checkEntities) => {
  const checks = await checkEntities({ code, entities, runPythonCode });
  return checks.every(Boolean);
};

interface CheckCode {
  code: string;
  task: Task;
  runPythonCode: runPythonCode;
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
  const mustHaveChecked = await checkMustHave({
    code,
    entities: task.restrictions.musthave,
    runPythonCode,
  });
  const forbiddenChecked = await checkForbidden({
    code,
    entities: task.restrictions.forbidden,
    runPythonCode,
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
  if (!(codeChecked && linesChecked && mustHaveChecked && forbiddenChecked)) {
    const errorList = [];
    !codeChecked && errorList.push(`☹️ ${L.ru.CE.error4}\n`);
    !mustHaveChecked && errorList.push(`😢 ${L.ru.CE.error1}\n`);
    !linesChecked && errorList.push(`🫤 ${L.ru.CE.error2}\n`);
    !forbiddenChecked && errorList.push(`🫢 ${L.ru.CE.error6}`);

    const errorMsg =
      L.ru.CE.CODE_ERROR_INTRO + errorList.join("") + L.ru.CE.CODE_ERROR_FOOTER;

    throw new Error(E_CODES.INVALID_EMAIL_SIGNUP_ERROR, { cause: errorMsg });
  }
  return "";
};

//TODO: (later) game
// https://www.taniarascia.com/sokoban-game/
// https://www.taniarascia.com/sokoban-game/
