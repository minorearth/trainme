import { stn } from "@/constants";

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

export default function usePythonRunner({ setOutput, pyodide }) {
  const runPythonCode = async (code, stdIn) => {
    if (pyodide) {
      let output = [];
      const stdout = (msg) => {
        output.push(msg);
        // setOutput(output.join("\n"));
      };

      const stdError = (msg) => {
        const error = msg.message.split("\n").slice(-2)[0];
        output.push(stn.errors.error5 + error);
        // setOutput(stn.errors.error5 + error);
      };
      try {
        const stdInSplitted = stdIn.split("\n");

        pyodide.setStdin(new StdinHandler(stdInSplitted));
        pyodide.setStdout({ batched: stdout });
        // setOutput([]);
        if (pyodide) {
          await pyodide.runPython(code);
          return { outputTxt: output.join("\n"), outputArr: output };
        }
      } catch (e) {
        stdError(e);
        return { outputTxt: output.join("\n"), outputArr: output };
      } finally {
        // stdout("");
      }
    }
  };

  return {
    runPythonCode,
  };
}
