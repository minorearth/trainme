import { stn } from "@/globals/constants";
import pyodide from "@/components/pyodide/pyodide";

// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197

class StdinHandler {
  stdIn: string[];
  idx: number;
  constructor(stdIn: string[]) {
    this.stdIn = stdIn;
    this.idx = 0;
    // Object.assign(this, options);
  }

  stdin() {
    return this.stdIn[this.idx++];
  }
}

export const runPythonCode = async ({
  code,
  stdIn,
}: {
  code: string;
  stdIn: string;
}) => {
  if (pyodide.pyodide) {
    let output: string[] = [];
    try {
      const stdInSplitted = stdIn.split("\n");
      pyodide.pyodide.setStdin(new StdinHandler(stdInSplitted));
      pyodide.pyodide.setStdout({
        batched: (msg: string) => {
          output.push(msg);
        },
      });

      await runCodeNoGLobals({ pyodide: pyodide.pyodide, code });
      return { outputTxt: output.join("\n"), outputArr: output };
    } catch (e: any) {
      const error = e.message.split("\n").slice(-2)[0];
      output.push(stn.errors.error5 + error);
      return { outputTxt: output.join("\n"), outputArr: output };
    }
  } else {
    return { outputTxt: "pyodide not avvailable", outputArr: [] };
  }
};

const runCodeNoGLobals = async ({
  pyodide,
  code,
}: {
  pyodide: any;
  code: string;
}) => {
  // https://github.com/pyodide/pyodide/issues/703

  const dict = pyodide.globals.get("dict");
  const globals = dict();
  await pyodide.runPython(code, { globals, locals: globals });

  globals.destroy();
  dict.destroy();
};
