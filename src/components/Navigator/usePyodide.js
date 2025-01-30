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

function usePyodide() {
  const [pyodide2, setPyodide] = useState(null);

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

  return {
    pyodide2,
  };
}

export default usePyodide;
