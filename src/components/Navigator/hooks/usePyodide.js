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

// function MyComponent() {
//   const [pyodide, setPyodide] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadPyodide = async () => {
//       // Загрузка скрипта pyodide.js из локальных файлов
//       const script = document.createElement('script');
//       script.src = '/pyodide/pyodide.js'; // путь к вашему файлу
//       script.onload = async () => {
//         // Инициализация pyodide
//         const pyodideInstance = await window.loadPyodide({
//           indexURL: '/pyodide/', // указываем папку с файлами
//         });
//         setPyodide(pyodideInstance);
//         setLoading(false);
//       };
//       document.body.appendChild(script);
//     };

//     loadPyodide();
//   }, []);

//   if (loading) return <div>Загрузка Pyodide...</div>;

function usePyodide() {
  const [pyodide2, setPyodide] = useState(null);

  const pyodideScriptStatus = useScript(
    `http://localhost:3000/pyodide/pyodide.js`
  );
  useEffect(() => {
    if (pyodideScriptStatus === "ready" && !pyodide2) {
      (async () => {
        const loadedPyodide = await globalThis.loadPyodide({
          indexURL: `/pyodide/`,
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
