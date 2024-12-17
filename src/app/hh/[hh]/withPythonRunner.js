import { useState, useEffect, useCallback } from "react";
import { useScript } from "@uidotdev/usehooks";
import { stn } from "@/constants";
const PYODIDE_VERSION = "0.26.4";

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

export default function usePythonRunner() {
  const [pyodide2, setPyodide] = useState(null);
  const [input, setInput] = useState("");
  const [consoleOutput2, setConsoleOutput2] = useState("");

  const pyodideScriptStatus = useScript(
    `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
  );
  useEffect(() => {
    if (pyodideScriptStatus === "ready" && !pyodide2) {
      (async () => {
        const loadedPyodide = await globalThis.loadPyodide({
          indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
        });
        setPyodide(loadedPyodide);
      })();
    }
  }, [pyodideScriptStatus, pyodide2]);

  const runPythonCode = async (code, stdIn) => {
    if (pyodide2) {
      let output = [];
      const stdout = (msg) => {
        output.push(msg);
        console.log("adsdsd", consoleOutput2);

        setConsoleOutput2(output.join("\n"));
      };

      const stdError = (msg) => {
        const error = msg.message.split("\n").slice(-2)[0];
        output.push(stn.errors.error5 + error);
        setConsoleOutput2(stn.errors.error5 + error);
      };
      try {
        const stdInSplitted = stdIn.split("\n");

        pyodide2.setStdin(new StdinHandler(stdInSplitted));
        pyodide2.setStdout({ batched: stdout });
        setConsoleOutput2([]);
        if (pyodide2) {
          await pyodide2.runPython(code);
          return output;
        }
      } catch (e) {
        stdError(e);
        return output;
      } finally {
        // stdout("");
      }
    }
  };

  return {
    pyodide2,
    runPythonCode,
    consoleOutput2,
    setConsoleOutput2,
    setStdIn: setInput,
    stdIn: input,
  };
}
