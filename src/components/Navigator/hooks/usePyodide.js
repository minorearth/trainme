import { useState, useEffect, useCallback } from "react";
import { useScript } from "@uidotdev/usehooks";
import { stn } from "@/constants";
const PYODIDE_VERSION = "0.26.4";

//TODO: configurate  the source of pyodide

// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197
import pyodide from "@/components/Navigator/store/pyodide";

function usePyodide() {
  const pyodideScriptStatus = useScript(
    `${process.env.NEXT_PUBLIC_DOMAIN}/pyodide/pyodide.js`
  );

  useEffect(() => {
    if (pyodideScriptStatus === "ready" && !pyodide.pyodide) {
      (async () => {
        const loadedPyodide = await globalThis.loadPyodide({
          indexURL: `/pyodide/`,
        });
        pyodide.setPyodide(loadedPyodide);
      })();
    }
  }, [pyodideScriptStatus]);

  return {};
}

export default usePyodide;

// function usePyodide() {
//   const [pyodide2, setPyodide] = useState(null);

//   const pyodideScriptStatus = useScript(
//     `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
//   );
//   useEffect(() => {
//     if (pyodideScriptStatus === "ready" && !pyodide2) {
//       (async () => {
//         const loadedPyodide = await globalThis.loadPyodide({
//           indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
//         });
//         setPyodide(loadedPyodide);
//       })();
//     }
//   }, [pyodideScriptStatus, pyodide2]);

//   return {
//     pyodide2,
//   };
// }
