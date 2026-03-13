import { E_CODES_DIALOG, L } from "@/tpconst/src";
import { v4 as uuidv4 } from "uuid";

let pyodideWorker: Worker | null = null;

interface WorkerMessage {
  id: string;
  stdIn?: string;
  code?: string;
}

interface ResponseMessage {
  id: string;
  result?: any;
  error?: string;
}

export function ensureWorker() {
  if (pyodideWorker) return pyodideWorker;
  if (typeof window === "undefined" || typeof window.Worker === "undefined") {
    throw new Error("Web Workers are not supported in this environment");
  }
  pyodideWorker = new Worker("/workers/webworker.mjs", { type: "module" });
  return pyodideWorker;
}

export function terminateWorker(): Worker {
  if (pyodideWorker) {
    pyodideWorker.terminate();
  }
  pyodideWorker = new Worker("/workers/webworker.mjs", { type: "module" });
  return pyodideWorker;
}

function getPromiseAndResolve<T>() {
  let resolve: (value: T | PromiseLike<T>) => void;
  let reject: (reason?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve: resolve!, reject: reject! };
}

function requestResponse(worker: Worker, msg: object): Promise<any> {
  const { promise, resolve, reject } = getPromiseAndResolve<any>();
  const id = uuidv4();

  function listener(event: MessageEvent<ResponseMessage>) {
    if (!event.data || event.data.id !== id) {
      return;
    }
    worker.removeEventListener("message", listener);
    const { result, error } = event.data;

    if (error) {
      reject(
        new Error(E_CODES_DIALOG.PYODIDE_SINTAX_ERROR, {
          cause: L.ru.CE.error5 + result,
        }),
      );
    } else {
      resolve(result);
    }
  }

  worker.addEventListener("message", listener);
  worker.postMessage({ id, ...msg });
  return promise;
}

export async function asyncRun(
  code: string,
  stdIn: string,
  worker?: Worker,
): Promise<any> {
  const usedWorker = worker ?? ensureWorker();
  return requestResponse(usedWorker, {
    stdIn,
    code,
  });
}

// function requestResponse(worker, msg) {
//   const { promise, resolve, reject } = getPromiseAndResolve();
//   const idWorker = uuidv4();

//   function listener(event) {
//     if (event?.data?.id !== idWorker) {
//       return;
//     }
//     worker.removeEventListener("message", listener);
//     const { id, ...rest } = event.data;
//     if (rest.error) {
//       reject(
//         new Error(E_CODES_DIALOG.PYODIDE_SINTAX_ERROR, {
//           cause: L.ru.CE.error5 + rest.result,
//         }),
//       );
//     } else {
//       resolve(rest.result);
//     }
//   }
//   worker.addEventListener("message", listener);
//   worker.postMessage({ id: idWorker, ...msg });
//   return promise;
// }
