import { stn } from "@/constants";
import pyodide from "@/components/Navigator/store/pyodide";

// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197

class StdinHandler {
  constructor(results, options) {
    this.results = results;
    this.idx = 0;
    Object.assign(this, options);
  }

  stdin() {
    return this.results[this.idx++];
  }
}

const runCodeNoGLobals = async (pyodide, code) => {
  // https://github.com/pyodide/pyodide/issues/703

  const dict = pyodide.globals.get("dict");
  const globals = dict();
  await pyodide.runPython(code, { globals, locals: globals });

  globals.destroy();
  dict.destroy();
};

export default function usePythonRunner() {
  const runPythonCode = async (code, stdIn) => {
    if (pyodide.pyodide) {
      let output = [];
      const stdout = (msg) => {
        output.push(msg);
      };

      const stdError = (msg) => {
        const error = msg.message.split("\n").slice(-2)[0];
        output.push(stn.errors.error5 + error);
      };
      try {
        const stdInSplitted = stdIn.split("\n");
        pyodide.pyodide.setStdin(new StdinHandler(stdInSplitted));
        pyodide.pyodide.setStdout({ batched: stdout });

        if (pyodide.pyodide) {
          await runCodeNoGLobals(pyodide.pyodide, code);
          return { outputTxt: output.join("\n"), outputArr: output };
        }
      } catch (e) {
        stdError(e);
        return { outputTxt: output.join("\n"), outputArr: output };
      } finally {
      }
    }
  };

  return {
    runPythonCode,
  };
}
