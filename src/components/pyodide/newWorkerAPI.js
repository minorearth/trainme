import { E_CODES_DIALOG, L, throwInnerErrorCause } from "@/tpconst/src";

let pyodideWorker = null;

export function ensureWorker() {
  if (pyodideWorker) return pyodideWorker;
  if (typeof window === "undefined" || typeof window.Worker === "undefined") {
    throw new Error("Web Workers are not supported in this environment");
  }
  pyodideWorker = new Worker("/workers/webworker.mjs", { type: "module" });
  return pyodideWorker;
}

export function terminateWorker() {
  pyodideWorker.terminate();
  pyodideWorker = new Worker("/workers/webworker.mjs", { type: "module" });
  return pyodideWorker;
}

// Каждый вызов получает уникальный id и ожидает ответ с тем же id
function getPromiseAndResolve() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// Уникальный идентификатор запроса (для простоты — число)
let lastId = 1;
function getId() {
  return lastId++;
}

function requestResponse(worker, msg) {
  const { promise, resolve, reject } = getPromiseAndResolve();
  const idWorker = getId();

  function listener(event) {
    if (event?.data?.id !== idWorker) {
      return;
    }
    worker.removeEventListener("message", listener);
    const { id, ...rest } = event.data;
    if (rest.error) {
      console.log("sdas", L.ru.CE.error5 + rest.error);
      reject(
        new Error(E_CODES_DIALOG.PYODIDE_SINTAX_ERROR, {
          cause: L.ru.CE.error5 + rest.result,
        }),
      );
    } else {
      resolve(rest.result);
    }
  }
  worker.addEventListener("message", listener);
  worker.postMessage({ id: idWorker, ...msg });
  return promise;
}

export async function asyncRun(code, stdIn, worker) {
  // const worker = ensureWorker();
  return requestResponse(worker, {
    stdIn,
    code,
  });
}
