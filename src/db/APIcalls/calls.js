export const setDataFetch = async (data) => {
  try {
    const response = await fetch("/api/setmeta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
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
