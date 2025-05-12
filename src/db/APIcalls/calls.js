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

setInterval(() => {
  //  wakeUp
}, 30000); // каждые 45 секунд

export const setDataFetch = async (data) => {
  wakeUp();
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
      // if (result.res == "error") {
      //   // throw new Error("Network response was not ok");
      // }
      return result.res;
    } catch (error) {
      return "error";
    }
  }, 1000);
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
