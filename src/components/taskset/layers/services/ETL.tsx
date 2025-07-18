import local from "@/globals/local";
import { fetchFile } from "@/apicalls/apicalls";
import { TaskDB } from "@/T/typesDB";
import { TaskDBWithFiles } from "@/T/typesState";
import { InOutDB } from "@/T/typesUpload";

export const supplyFilesAndTransform = async (tasks: TaskDB[]) => {
  const tasksWithFiles = await supplyWithFilesData(tasks);
  const enrichedTasks = supplyWithFriendlyText(tasksWithFiles);
  return enrichedTasks;
};

interface FileNamesAndUrls {
  [filename: string]: { fileurl: string; data: string };
}

//Tranform Data
const supplyWithFriendlyText = (tasksWithFiles: TaskDBWithFiles[]) => {
  const enrichedTasks = tasksWithFiles.map((task) => ({
    ...task,
    tasktext:
      task.task +
      formatForbidden({
        forbidden: task.restrictions.forbidden,
        maxlines: task.restrictions.maxlines,
        tasktype: task.tasktype,
      }),
  }));
  return enrichedTasks;
};

const formatForbidden = ({
  forbidden,
  maxlines,
  tasktype,
}: {
  forbidden: string[];
  maxlines: number;
  tasktype: string;
}) => {
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

const supplyWithFilesData = async (tasks: TaskDB[]) => {
  const filesAndUrls = extractFileNames({ tasks });
  const filesAndFileContent = await getTaskFilesData({ filesAndUrls });
  const { tasksWithFiles } = enrichTaskWithFileLoadCode({
    tasks,
    filesAndFileContent,
  });
  return tasksWithFiles;
};

const enrichTaskWithFileLoadCode = ({
  tasks,
  filesAndFileContent,
}: {
  tasks: TaskDB[];
  filesAndFileContent: FileNamesAndUrls;
}) => {
  const tasksWithFiles = tasks.map((task) => ({
    ...task,
    inout: task.inout.map((inouttest: InOutDB) => {
      const filesdata = getFilesData(inouttest, filesAndFileContent);
      return {
        filesdata,
        inv: inouttest.inv,
        outv: inouttest.outv,
      };
    }),
    filedata: getFilesData(task.inout[0], filesAndFileContent).join("\n"),
  }));

  return { tasksWithFiles };
};

const getFilesData = (
  inouttest: InOutDB,
  filesAndFileContent: FileNamesAndUrls
) => {
  let filesdata: string[] = [];
  inouttest.inv.forEach((filename) => {
    filename.includes(".txt")
      ? filesdata.push(
          `f=open("${filename}", 'w')\nf.write("${filesAndFileContent[filename].data}")\nf.close()\n`
        )
      : filesdata.push("");
  });
  return filesdata;
};

const getTaskFilesData = async ({
  filesAndUrls,
}: {
  filesAndUrls: FileNamesAndUrls;
}) => {
  await Promise.all(
    Object.keys(filesAndUrls).map(async (file) => {
      filesAndUrls[file] = {
        ...filesAndUrls[file],
        data: (await fetchFile(filesAndUrls[file].fileurl)) || "",
      };
    })
  );
  return filesAndUrls;
};

const extractFileNames = ({ tasks }: { tasks: TaskDB[] }) => {
  const files: FileNamesAndUrls = {};
  tasks.forEach((task) => {
    task.inout.forEach((inout) => {
      inout.inv
        .filter((item) => item.includes(".txt"))
        .forEach(
          (filename) =>
            //TODO:"http://localhost:3000/"
            (files[filename] = {
              fileurl:
                "http://localhost:3000/" +
                // "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +
                filename,
              data: "",
            })
        );
    });
  });
  return files;
};
