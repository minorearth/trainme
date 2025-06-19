import local from "@/globals/local";
export const ETL = async (tasks) => {
  await loadAllFiles(tasks);

  tasks.forEach((task) => {
    task.tasktext =
      task.task +
      formatForbidden(
        task.restrictions.forbidden,
        task.restrictions.maxlines,
        task.tasktype
      );
    task.input = task.defaultinput.join("\n");
    task.code = task.defaultcode;
    task.expectedOutput = task.defaultoutput.join("\n");
    task.maxlines = task.restrictions.maxlines;
    task.filedata =
      task.inout[0].filesdata && task.inout[0].filesdata.join("\n");
    task.output = "";
    task.restrictErrors = "";
  });
  return tasks;
};

const formatForbidden = (forbidden, maxlines, tasktype) => {
  let res = "";
  if (tasktype != "task") {
    return "";
  }
  res += `\n\n<b>Ограничения</b>:\nМаксимальное количество строк кода: ${maxlines}`;

  if (forbidden.length) {
    const forbiddentsample = local.ru.forbiddentsample;
    res += `\nЗапрещенные приёмы:`;
    for (let i = 0; i < forbidden.length; i++) {
      res += `<div class="tooltip">${forbidden[i]}, <span class="tooltiptext">${
        forbiddentsample[forbidden[i]]
      }</span></div>`;
    }
  }
  return res;
};

const fetchFile = async (fileUrl) => {
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

const loadAllFiles = async (tasks) => {
  const files = {};
  tasks.forEach((task) => {
    task.inout.forEach((inout) => {
      inout.inv
        .filter((item) => item.includes(".txt"))
        .forEach(
          (item) =>
            (files[item] = {
              fileurl:
                "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +
                item,
            })
        );
    });
  });

  await Promise.all(
    Object.keys(files).map(async (file) => {
      files[file] = {
        fileurl: files[file].fileurl,
        data: await fetchFile(files[file].fileurl),
      };
    })
  );

  tasks.forEach((task) => {
    task.inout.forEach((inouttest) => {
      inouttest.filesdata = [];
      inouttest.inv.forEach((item) => {
        item.includes(".txt")
          ? inouttest.filesdata.push(
              `f=open("${item}", 'w')\nf.write("${files[item].data}")\nf.close()\n`
            )
          : inouttest.filesdata.push("");
      });
    });
  });
};
