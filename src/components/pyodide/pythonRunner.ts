import pyodide from "@/components/pyodide/pyodide";
import { L } from "@/tpconst/src/lang";
import { asyncRun, terminateWorker } from "./newWorkerAPI";
import { E_CODES_DIALOG, throwInnerError } from "@/tpconst/src";

// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197

// class StdinHandler {
//   stdIn: string[];
//   idx: number;
//   constructor(stdIn: string[]) {
//     this.stdIn = stdIn;
//     this.idx = 0;
//     // Object.assign(this, options);
//   }

//   stdin() {
//     return this.stdIn[this.idx++];
//   }
// }

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
    // const error = e as Error;
    // return { outputTxt: error.message, outputArr: [] };
  }
};

export const runApprovedPythonCode = async ({ code }: { code: string }) => {
  console.log("im here2", code);

  try {
    return await asyncRun(code, "", pyodide.worker);
  } catch (e) {
    console.log("im here");
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

const runCodeNoGLobals = async ({
  pyodide,
  code,
}: {
  //confirm any
  pyodide: any;
  code: string;
}) => {
  // https://github.com/pyodide/pyodide/issues/703
  // https://github.com/pyodide/pyodide/issues/4139
  const dict = pyodide.globals.get("dict");
  const globals = dict();

  await pyodide.runPython(
    // code,
    code +
      "\nimport os\nimport sys\nsys.stdout.flush()\nos.fsync(sys.stdout.fileno())",
    {
      globals,
      locals: globals,
    },
  );
  globals.destroy();
  dict.destroy();
};

// export const runPythonCode = async ({
//   code,
//   stdIn,
// }: {
//   code: string;
//   stdIn: string;
// }) => {
//   if (pyodide.pyodide) {
//     let output: string[] = [];
//     try {
//       const stdInSplitted = stdIn.split("\n");
//       pyodide.pyodide.setStdin(new StdinHandler(stdInSplitted));
//       pyodide.pyodide.setStdout({
//         batched: (msg: string) => {
//           output.push(msg);
//         },
//       });

//       await runCodeNoGLobals({ pyodide: pyodide.pyodide, code });
//       return {
//         outputTxt: output.join("\n"),
//         outputArr: output,
//       };
//     } catch (e) {
//       if (e instanceof Error) {
//         const error = e.message.split("\n").slice(-2)[0];
//         output.push(L.ru.CE.error5 + error);
//         return {
//           outputTxt: output.join("\n"),
//           outputArr: output,
//         };
//       } else {
//         return { outputTxt: "some error", outputArr: [] };
//       }
//     }
//   } else {
//     return { outputTxt: "pyodide not avvailable", outputArr: [] };
//   }
// };
