import local from "@/globals/local";
import { getTaskFilesData } from "@/components/taskset/store/repository";
import { extractFileNames } from "@/components/taskset/store/utils";
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

const loadAllFiles = async (tasks) => {
  const filesAndUrls = extractFileNames({ tasks });
  const filesAndFileContent = await getTaskFilesData({ filesAndUrls });
  enrichTaskWithFileLoadCode({ tasks, filesAndFileContent });
};
