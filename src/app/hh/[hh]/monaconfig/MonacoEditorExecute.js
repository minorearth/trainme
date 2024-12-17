// // import { loadPyodide } from "pyodide";
// import { useScript } from "@uidotdev/usehooks";

// let consoleOutput = [];
// const stdout = (msg) => consoleOutput.push(msg);

// const [pyodide2, setPyodide] = useState(null);

// const pyodideScriptStatus = useScript(
//   `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`
// );

// useEffect(() => {
//   if (pyodideScriptStatus === "ready" && !pyodide2) {
//     (async () => {
//       const loadedPyodide = await globalThis.loadPyodide({
//         indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
//         stdout: stdout,
//         stderr: stdout,
//       });
//       setPyodide(loadedPyodide);
//     })();
//   }
// }, [pyodideScriptStatus, pyodide2]);

// export const LoadPyodide = async () => {
//   return await globalThis.loadPyodide({
//     indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
//     stdout: stdout,
//     stderr: stdout,
//     packages: ["numpy", "scipy", "pandas", "scikit-learn"],
//   });
// };

// export const ExecuteCode = async (pyodide, code) => {
//   consoleOutput = [];

//   try {
//     if (pyodide) await pyodide.runPythonAsync(code);
//   } catch (e) {
//     stdout(e.stack);
//   } finally {
//     stdout(`[editor: last executed at ${new Date().toLocaleString("en-us")}]`);
//   }

//   return consoleOutput;
// };
