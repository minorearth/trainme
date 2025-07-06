import local from "@/globals/local";
import { fetchFile } from "@/apicalls/apicalls";

export const supplyFilesAndTransform = async (tasks) => {
  await supplyWithFilesData(tasks);
  tranformData(tasks);
  return tasks;
};

//Tranform Data
const tranformData = (tasks) => {
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

//Upload files data

const supplyWithFilesData = async (tasks) => {
  const filesAndUrls = extractFileNames({ tasks });
  const filesAndFileContent = await getTaskFilesData({ filesAndUrls });
  enrichTaskWithFileLoadCode({ tasks, filesAndFileContent });
};

const enrichTaskWithFileLoadCode = ({ tasks, filesAndFileContent }) => {
  tasks.forEach((task) => {
    task.inout.forEach((inouttest) => {
      inouttest.filesdata = [];
      inouttest.inv.forEach((item) => {
        item.includes(".txt")
          ? inouttest.filesdata.push(
              `f=open("${item}", 'w')\nf.write("${filesAndFileContent[item].data}")\nf.close()\n`
            )
          : inouttest.filesdata.push("");
      });
    });
  });
};

const getTaskFilesData = async ({ filesAndUrls }) => {
  await Promise.all(
    Object.keys(filesAndUrls).map(async (file) => {
      filesAndUrls[file] = {
        fileurl: filesAndUrls[file].fileurl,
        data: await fetchFile(filesAndUrls[file].fileurl),
      };
    })
  );
  return filesAndUrls;
};

const extractFileNames = ({ tasks }) => {
  const files = {};
  tasks.forEach((task) => {
    task.inout.forEach((inout) => {
      inout.inv
        .filter((item) => item.includes(".txt"))
        .forEach(
          (filename) =>
            (files[filename] = {
              fileurl:
                "http://localhost:3000/" +
                // "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +
                filename,
            })
        );
    });
  });
  return files;
};
