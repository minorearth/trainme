import { L } from "@/tpconst/src/lang";
import { fetchFile } from "@/app/api/apicalls/apicalls";
import { Guide, GuideDBWithFiles, Task, TaskDB, UnitDB } from "@/tpconst/src/T";
import { TaskDBWithFiles } from "@/tpconst/src/T";
import { InOutDB } from "@/tpconst/src/T";
import { TT } from "@/tpconst/src/const";
import { allregex } from "./allregex";

export const supplyFilesAndTransform = async (tasks: UnitDB[]) => {
  const tasksWithFiles = await supplyWithFilesData(tasks);
  const enrichedTasks = supplyWithFriendlyText(tasksWithFiles);
  return enrichedTasks.sort((a, b) => a.taskorder - b.taskorder);
};

interface FileNamesAndUrls {
  [filename: string]: { fileurl: string; data: string };
}

interface allregex {
  [key: string]: {
    caption: string;
    ex: string;
    rgx: string[];
  };
}

//Tranform Data
const supplyWithFriendlyText = (
  tasksWithFiles: TaskDBWithFiles[] | GuideDBWithFiles[],
) => {
  const enrichedTasks = tasksWithFiles.map((task) => {
    if (task.tasktype == "task") {
      const t = task as TaskDBWithFiles;
      return {
        ...t,
        tasktext:
          t.task +
          formatForbidden({
            forbidden: t.restrictions.forbidden,
            musthave: t.restrictions.musthave,
            maxlines: t.restrictions.maxlines,
            tasktype: t.tasktype,
            allregex,
          }),
      } as Task;
    } else {
      return task as Guide;
    }
  });
  return enrichedTasks;
};

const formatForbidden = ({
  forbidden,
  musthave,
  maxlines,
  tasktype,
  allregex,
}: {
  forbidden: string[];
  musthave: string[];
  maxlines: number;
  tasktype: string;
  allregex: allregex;
}) => {
  let res = "";
  if (tasktype != TT.task) {
    return "";
  }

  res += `\n\n<div><b>${L.ru.TR.LIMITATIONS_CAPTION}</b></div>\n<div>  ${L.ru.TR.LIMITATIONS_MAXLINES} ${maxlines}</div>`;
  if (forbidden.length) {
    res += `\n<div class="tooltip">  ${L.ru.TR.LIMITATIONS_FORBIDDEN}</div>`;
    const frbdn = forbidden.map(
      (forbidden) =>
        `<div class="tooltip">${allregex[forbidden].caption}<span class="tooltiptext">${allregex[forbidden].ex}</span></div>`,
    );
    res += ` ${frbdn.join(", ")}\n`;
  }

  if (musthave.length) {
    res += `\n<div class="tooltip">  ${L.ru.TR.LIMITATIONS_MUSTHAVE}</div>`;
    const frbdn = musthave.map(
      (musthave) =>
        `<div class="tooltip">${allregex[musthave].caption}<span class="tooltiptext">${allregex[musthave].ex}</span></div>`,
    );
    res += ` ${frbdn.join(", ")}`;
  }
  return res;
};

//Upload files data

const supplyWithFilesData = async (tasks: UnitDB[]) => {
  const filesAndUrls = extractFileNames({ tasks });
  const filesAndFileContent = await getTaskFilesData({ filesAndUrls });
  const { tasksWithFiles } = enrichTaskWithFileLoadCode({
    tasks,
    filesAndFileContent,
  });
  return tasksWithFiles as GuideDBWithFiles[] | TaskDBWithFiles[];
};

const enrichTaskWithFileLoadCode = ({
  tasks,
  filesAndFileContent,
}: {
  tasks: UnitDB[];
  filesAndFileContent: FileNamesAndUrls;
}) => {
  const tasksWithFiles = tasks.map((task) => ({
    ...task,
    inout: task.inout.map((inouttest) => {
      const filesdata = getFilesData(inouttest.inv, filesAndFileContent);
      return {
        filesdata,
        ...inouttest,
        inv: inouttest.inv,
      };
    }),
    filedata: getFilesData(task.inout[0].inv, filesAndFileContent).join("\n"),
  }));

  return { tasksWithFiles };
};

const getFilesData = (inv: string[], filesAndFileContent: FileNamesAndUrls) => {
  let filesdata: string[] = [];
  inv.forEach((filename) => {
    filename.includes(".txt")
      ? filesdata.push(
          `f=open("${filename}", 'w')\nf.write("${filesAndFileContent[filename].data}")\nf.close()\n`,
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
    }),
  );
  return filesAndUrls;
};

// "https://hog6lcngzkudsdma.public.blob.vercel-storage.com/a3905595-437e-47f3-b749-28ea5362bd39/d06b8c0d-4837-484a-ad85-9257e0e6af01/" +

const extractFileNames = ({ tasks }: { tasks: UnitDB[] }) => {
  const files: FileNamesAndUrls = {};
  console.log("tasks", tasks);
  tasks.forEach((task) => {
    task.inout.forEach((inout) => {
      inout.inv
        .filter((item) => item.includes(".txt"))
        .forEach(
          (filename) =>
            (files[filename] = {
              fileurl: `${process.env.NEXT_PUBLIC_DOMAIN}/${filename}`,
              data: "",
            }),
        );
    });
  });
  return files;
};
