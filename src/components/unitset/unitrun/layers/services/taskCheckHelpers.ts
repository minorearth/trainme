import { L } from "@/tpconst/src/lang";

import { eqArrays } from "@/tpconst/src/utils";
import { Task } from "@/tpconst/src/T";
import { allregex } from "@/components/unitset/layers/services/allregex";
import {
  ast,
  astClean,
} from "@/components/unitset/unitrun/layers/services/ast";
import { E_CODES, throwInnerError } from "@/tpconst/src/errorHandlers";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import pyodide from "@/components/pyodide/pyodide";

import {
  runApprovedPythonCode,
  runPythonCode,
  runPythonCodeRace,
} from "@/components/pyodide/pythonRunner";

// const cleanUpCode = (code: string) => {
//   const lines = code.match(/[^\r\n]+/g) ?? [];
//   const res = lines
//     .map((line) => line.replaceAll(/#.*/g, ""))
//     .map((line) => line.replaceAll("\\n", "\\\\n"))
//     .filter((line) => line != "");
//   return res;
// };

interface CheckLines {
  code: string;
  maxlines: number;
}

const checkLines = async ({ code, maxlines }: CheckLines) => {
  const outputArr = await getAstCleanCodeArr(code);
  return maxlines >= outputArr.length;
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
}

const getAstCleanCodeArr = async (code: string) => {
  try {
    const outputArr = await runApprovedPythonCode({
      code: astClean({ code: JSON.stringify(code) }),
    });
    return outputArr;
  } catch (e) {
    throw new Error();
  }
};

export const magicCode = async () => {
  try {
    const codeCleaned = await getAstCleanCodeArr(unit.editors[0].codepart);
    unit.editors[0].editorRef.current?.setValue(codeCleaned.join("\n"));
  } catch (e) {}
};

const astSinglelineCleanCode = async (code: string) => {
  const res = await getAstCleanCodeArr(code);
  return res.join("\\n").replaceAll('"', '\\"');
};

const checkEntities = async ({ code, entities }: checkEntities) => {
  const onelinecode = await astSinglelineCleanCode(code);
  let checks: Boolean[] = [];
  for (let item of entities) {
    if (allregex[item].findmode == "regex") {
      //not used but kept on hold
      // const regex = new RegExp(allregex[item].rgx[0], "gs");
      // return codeLines.match(regex) != null;
    } else {
      const { nm, param, type } = allregex[item];
      const { outputArr } = await runPythonCode({
        code: ast({ code: onelinecode, nm, param, type }),
        stdIn: "",
      });

      checks.push(outputArr[0] == "True");
    }
  }
  return checks;
};

// const checkEntities = async ({ code, entities }: checkEntities) => {
//   const onelinecode = await astSinglelineCleanCode(code);

//   const checks = await Promise.all(
//     entities.map(async (item) => {
//       if (allregex[item].findmode == "regex") {
//         //not used but kept on hold
//         // const regex = new RegExp(allregex[item].rgx[0], "gs");
//         // return codeLines.match(regex) != null;
//       } else {
//         const { nm, param, type } = allregex[item];
//         const { outputArr } = await runPythonCode({
//           code: ast({ code: onelinecode, nm, param, type }),
//           stdIn: "",
//         });

//         return outputArr[0] == "True";
//       }
//     }),
//   );
//   return checks;
// };

const checkForbidden = async ({ code, entities }: checkEntities) => {
  const checks = await checkEntities({ code, entities });

  return !checks.some(Boolean);
};

const checkMustHave = async ({ code, entities }: checkEntities) => {
  const checks = await checkEntities({ code, entities });
  return checks.every(Boolean);
};

const checkCode = async ({ code, task }: { code: string; task: Task }) => {
  let results = [];
  for (let i = 0; i < task.inout.length; i++) {
    try {
      const { outputArr } = await runPythonCodeRace({
        code: task.inout[i].filesdata.join("\n") + code,
        stdIn: task.inout[i].inv.join("\n"),
      });
      results.push(eqArrays(outputArr, task.inout[i].outv));
    } catch (e) {
      //TODO: three types of error handdlers should be here

      return false;
    }
  }
  return results.every(Boolean);
};

export const runCheckers = async ({
  code,
  task,
  skipcodecheck,
}: {
  code: string;
  task: Task;
  skipcodecheck: boolean;
}) => {
  pyodide.setExecuting(true);
  const codeChecked = !skipcodecheck ? await checkCode({ code, task }) : true;
  const linesChecked = await checkLines({
    code,
    maxlines: task.restrictions.maxlines,
  });

  const mustHaveChecked = await checkMustHave({
    code,
    entities: task.restrictions.musthave,
  });

  const forbiddenChecked = await checkForbidden({
    code,
    entities: task.restrictions.forbidden,
  });
  pyodide.setExecuting(false);
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
