// https://www.reddit.com/r/nextjs/comments/194r5jn/does_anyone_know_how_to_use_pyodide_with_nextjs/?rdt=49197

import { useEffect } from "react";
import { useScript } from "@uidotdev/usehooks";
import S from "@/globals/settings";
import pyodide from "@/components/pyodide/pyodide";
// type loadPyodide  = (options: { indexURL: string }) => Promise<any>;

function usePyodide() {
  const pyodideScriptStatus = useScript(
    S.mode.pyodideCDN
      ? `https://cdn.jsdelivr.net/pyodide/v${S.PYODIDE_VERSION}/full/pyodide.js`
      : `${process.env.NEXT_PUBLIC_DOMAIN}/pyodide/pyodide.js`
  );

  useEffect(() => {
    if (pyodideScriptStatus === "ready" && !pyodide.pyodide) {
      (async () => {
        //confirm as
        const loadPyodide = (globalThis as any).loadPyodide as (options: {
          indexURL: string;
        }) => Promise<any>;
        const loadedPyodide = await loadPyodide({
          indexURL: S.mode.pyodideCDN
            ? `https://cdn.jsdelivr.net/pyodide/v${S.PYODIDE_VERSION}/full/`
            : `/pyodide/`,
        });
        pyodide.setPyodide(loadedPyodide);
      })();
    }
  }, [pyodideScriptStatus]);

  return {};
}

export default usePyodide;
