import { toJS } from "mobx";

//services(external)
import {
  runCheckers,
  getErrorMessage,
} from "@/components/unitset/unitrun/layers/services/taskCheckHelpers";

//Stores
import unitset from "@/components/unitset/layers/store/unitset";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import { dialogs } from "@/components/common/dialog/dialogMacro";
import { E_CODES, E_CODES_DIALOG } from "@/tpconst/src/errorHandlers";
import { Task } from "@/tpconst/src";
import pyodide from "@/components/pyodide/pyodide";
import { finalErrorHandler, throwInnerError } from "@/tpconst/dist";

const performTests = async ({ skipcodecheck }: { skipcodecheck: boolean }) => {
  try {
    const res = await runCheckers({
      code: unit.editors[0].codepart,
      task: unit.currUnit as Task,
      skipcodecheck,
    });
    return res;
  } catch (e) {
    throw throwInnerError(e);
  }
};

export const checkTaskAction = async () => {
  pyodide.setExecuting(true);
  try {
    const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests({ skipcodecheck: false });
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

    if (e.message == E_CODES.TASK_CHECK_FAIL) {
      await unitset.actions.nextUnitOrCompleteUnitsRun({
        error: true,
        errorMsg: e.cause as string,
        code: unit.editors[0].codepart || "",
      });
    }
    if (e.message == E_CODES_DIALOG.PYODIDE_SUSPENDED) {
      await unitset.actions.nextUnitOrCompleteUnitsRun({
        error: true,
        errorMsg: "Превышено время ожидания" as string,
        code: unit.editors[0].codepart || "",
      });
    }
    if (e.message == E_CODES_DIALOG.PYODIDE_SINTAX_ERROR) {
      await unitset.actions.nextUnitOrCompleteUnitsRun({
        error: true,
        errorMsg: "Ошибка синтаксиса" as string,
        code: unit.editors[0].codepart || "",
      });
    }
  } finally {
    pyodide.setExecuting(false);
  }
};

export const preCheckTaskAction = async () => {
  try {
    const { linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests({ skipcodecheck: true });

    const res = !linesChecked || !mustHaveChecked || !forbiddenChecked;
    if (res) {
      dialogs.basic({
        ...L.ru.msg[E_CODES_DIALOG.RESTRICTIONS_NOT_PASSED].params,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES_DIALOG.RESTRICTIONS_PASSED].params,
      });
    }
  } catch (e) {
    const error = e as Error;

    if (error.message == E_CODES_DIALOG.PYODIDE_SINTAX_ERROR) {
      dialogs.basic({
        ...L.ru.msg[E_CODES_DIALOG.PYODIDE_SINTAX_ERROR].params,
      });
    } else if (error.message == E_CODES_DIALOG.PYODIDE_SUSPENDED) {
      dialogs.basic({
        ...L.ru.msg[E_CODES_DIALOG.PYODIDE_SUSPENDED].params,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES_DIALOG.UNKNOWN_ERROR].params,
      });
    }
  }
};

export const checkOnChangeErrors = ({ lineCount }: { lineCount: number }) => {
  return lineCount > (unit.currUnit as Task).restrictions.maxlines &&
    unit.currUnit.unittype != TT.guide
    ? L.ru.ME.MAX_LINES_ERROR
    : "";
};
