import { toJS } from "mobx";

//services(external)
import {
  runCheckers,
  getErrorMessage,
} from "@/components/unitset/unitrun/layers/services/taskCheckHelpers";
import { runPythonCode } from "@/components/pyodide/pythonRunner";

//Stores
import unitset from "@/components/unitset/layers/store/unitset";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import { dialogs } from "@/components/common/dialog/dialogMacro";
import { E_CODES } from "@/tpconst/src/errorHandlers";
import { Task } from "@/tpconst/src";

const performTests = async () => {
  const monaco = unit.editors[0].monacoRef.current;

  if (!monaco || unit.editors[0].executing || !unit.editors[0].codepart) {
    throw new Error();
  }
  return await runCheckers({
    code: unit.editors[0].codepart,
    task: unit.currUnit as Task,
    runPythonCode,
  });
};

export const checkTaskAction = async () => {
  try {
    const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests();
    try {
      getErrorMessage({
        codeChecked,
        linesChecked,
        mustHaveChecked,
        forbiddenChecked,
      });
      await unitset.actions.nextUnitOrCompleteUnitsRun({
        error: false,
        code: unit.editors[0].codepart || "",
      });
    } catch (error: unknown) {
      const e = error as Error;
      await unitset.actions.nextUnitOrCompleteUnitsRun({
        error: true,
        errorMsg: e.cause as string,
        code: unit.editors[0].codepart || "",
      });
    }
  } catch (e: unknown) {
    return;
  }
};

export const preCheckTaskAction = async () => {
  try {
    const { linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests();

    const res = !linesChecked || !mustHaveChecked || !forbiddenChecked;
    if (res) {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RESTRICTIONS_NOT_PASSED].params,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RESTRICTIONS_PASSED].params,
      });
    }
  } catch (e: unknown) {
    return;
  }
};

export const checkOnChangeErrors = ({ lineCount }: { lineCount: number }) => {
  return lineCount > (unit.currUnit as Task).restrictions.maxlines &&
    unit.currUnit.unittype != TT.guide
    ? L.ru.ME.MAX_LINES_ERROR
    : "";
};
