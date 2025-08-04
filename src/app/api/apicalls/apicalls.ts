import S from "@/globals/settings";
import { GetDataFetchTypes, ServerResponseData, SetDataFetch } from "tpconst/T";
import { throwFetchAPIError, throwInnerError } from "tpconst/errorHandlers";
import { E_CODES } from "tpconst/errorHandlers";

export const wakeUp = () => {
  fetch("/api/wakeup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((res) => console.log("Pinged API to keep awake"))
    .catch((error) => {
      throw throwInnerError(new Error(E_CODES.WAKEUP_API_FAILED));
    });
};

interface setDataFetch {
  type: SetDataFetch;
  data: string;
}
export const setDataFetch = async (request: setDataFetch) => {
  console.log("request", request);
  try {
    wakeUp();
    const res = await new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const response = await fetch(S.P.SETMETA, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
          });
          if (!response.ok) {
            const result = await response.json();
            console.log("я тут");
            throw throwFetchAPIError(new Error(result.message));
          }
          const result = await response.json();
          resolve(result.res);
        } catch (error) {
          reject(error);
        }
      }, 1000);
    });
    return res;
  } catch (error) {
    throw throwInnerError(error);
  }
};

interface GetDataFetch {
  type: GetDataFetchTypes;
  //(later)TODO: do types
  data: Object;
}
export const getDataFetch = async <T>(request: GetDataFetch) => {
  try {
    const response = await fetch(S.P.GETMETA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      const result = await response.json();
      throw throwFetchAPIError(result);
    }
    const result: ServerResponseData<T> = await response.json();
    return result.value;
  } catch (error) {
    throw throwInnerError(error);
  }

  // https://www.reddit.com/r/nextjs/comments/1944xx3/server_actions_not_returning_an_answer/?rdt=59377
  // Yes, self deployed on google cloud. My solution at the time was to switch to api routes and that worked fine. Recently with the new updates of nextjs, I have tried server actions again and they work fine now.Yes, self deployed on google cloud. My solution at the time was to switch to api routes and that worked fine. Recently with the new updates of nextjs, I have tried server actions again and they work fine now.
};

export const fetchFile = async (fileUrl: string) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.text();
    return data.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  } catch (error) {
    throw throwFetchAPIError(error);
  }
};
