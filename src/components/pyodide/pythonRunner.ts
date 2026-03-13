import pyodide from "@/components/pyodide/pyodide";
import { asyncRun, terminateWorker } from "./newWorkerAPI";
import { E_CODES_DIALOG, throwInnerError } from "@/tpconst/src";

// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197

export const runPythonCode = async ({
  code,
  stdIn,
}: {
  code: string;
  stdIn: string;
}) => {
  try {
    const output = await asyncRun(code, stdIn, pyodide.worker);
    return {
      outputTxt: output.join("\n"),
      outputArr: output,
    };
  } catch (e) {
    return throwInnerError(e);
  }
};

export const runApprovedPythonCode = async ({ code }: { code: string }) => {
  try {
    return await asyncRun(code, "", pyodide.worker);
  } catch (e) {
    return throwInnerError(e);
  }
};

export const runPythonCodeRace = async ({
  code,
  stdIn,
}: {
  code: string;
  stdIn: string;
}) => {
  let isTimeout = false;

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      isTimeout = true;
      resolve(null);
    }, 2000);
  });

  const codePromise = runPythonCode({
    code,
    stdIn,
  });

  try {
    const res = await Promise.race([codePromise, timeoutPromise]);
    if (!isTimeout) {
      const { outputTxt, outputArr } = res as {
        outputTxt: string;
        outputArr: string[];
      };
      return { outputTxt, outputArr };
    } else {
      const worker = terminateWorker();
      pyodide.setPyodideWorker(worker);
      throw new Error(E_CODES_DIALOG.PYODIDE_SUSPENDED);
    }
  } catch (e) {
    return throwInnerError(e);
  }
};
