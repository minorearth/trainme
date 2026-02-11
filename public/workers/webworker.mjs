import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.mjs";

let pyodideReadyPromise = loadPyodide();

class StdinHandler {
  stdIn;
  idx;
  constructor(stdIn) {
    this.stdIn = stdIn;
    this.idx = 0;
    // Object.assign(this, options);
  }

  stdin() {
    return this.stdIn[this.idx++];
  }
}

self.onmessage = async (event) => {
  const { id, code, stdIn } = event.data;

  // try {
  const pyodide = await pyodideReadyPromise;
  await pyodide.loadPackagesFromImports(code);
  // const dict = pyodide.globals.get("dict");
  // const globals = dict(Object.entries(context));
  let output = [];
  if (stdIn != "") {
    const stdInSplitted = stdIn.split("\n");
    pyodide.setStdin(new StdinHandler(stdInSplitted));
  }

  pyodide.setStdout({
    batched: (msg) => {
      output.push(msg);
    },
  });

  const dict = pyodide.globals.get("dict");
  const globals = dict();

  try {
    await pyodide.runPythonAsync(
      code +
        "\nimport os\nimport sys\nsys.stdout.flush()\nos.fsync(sys.stdout.fileno())",
      { globals, locals: globals },
    );
    self.postMessage({ result: output, id, error: false });
  } catch (e) {
    if (e instanceof Error) {
      const error = e.message.split("\n").slice(-2)[0];
      self.postMessage({ result: error, id, error: true });

      // output.push(L.ru.CE.error5 + error);
      // return { outputTxt: "some error", outputArr: [] };
    }
  }

  // pyodide.setStdout(null);
  // pyodide.setStderr(null);

  // } catch (error) {
  //   self.postMessage({ error: error.message, id });
  // }
};
