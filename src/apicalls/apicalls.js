export const wakeUp = () => {
  fetch("/api/wakeup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: "",
  })
    .then((res) => console.log("Pinged API to keep awake"))
    .catch((err) => console.error("Ping failed", err));
};

export const setDataFetch = async (data) => {
  wakeUp();
  const res = await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const response = await fetch("/api/setmeta", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        resolve(result.res);
      } catch (error) {
        resolve("error");
      }
    }, 1000);
  });
  return res;
};

export const getDataFetch = async (data) => {
  try {
    const response = await fetch("/api/getmeta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }

  // https://www.reddit.com/r/nextjs/comments/1944xx3/server_actions_not_returning_an_answer/?rdt=59377
  // Yes, self deployed on google cloud. My solution at the time was to switch to api routes and that worked fine. Recently with the new updates of nextjs, I have tried server actions again and they work fine now.Yes, self deployed on google cloud. My solution at the time was to switch to api routes and that worked fine. Recently with the new updates of nextjs, I have tried server actions again and they work fine now.
};

export const fetchFile = async (fileUrl) => {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.text();
    return data.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
