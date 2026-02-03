import { L } from "@/tpconst/src/lang";
import { fetchFile } from "@/app/api/apicalls/apicalls";
import { Guide, GuideDBWithFiles, Task, TaskDB, UnitDB } from "@/tpconst/src/T";
import { TaskDBWithFiles } from "@/tpconst/src/T";
import { TT } from "@/tpconst/src/const";
import { allregex } from "./allregex";

export const supplyFilesAndTransform = async (units: UnitDB[]) => {
  const unitsWithFiles = await supplyWithFilesData(units);
  const enrichedUnits = supplyTasksWithFriendlyText(unitsWithFiles);
  return enrichedUnits.sort((a, b) => a.unitorder - b.unitorder);
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
const supplyTasksWithFriendlyText = (
  unitsWithFiles: TaskDBWithFiles[] | GuideDBWithFiles[],
) => {
  const enrichedUnits = unitsWithFiles.map((unit) => {
    if (unit.unittype == TT.task) {
      const task = unit as TaskDBWithFiles;
      return {
        ...task,
        tasktext:
          task.task +
          formatForbidden({
            forbidden: task.restrictions.forbidden,
            musthave: task.restrictions.musthave,
            maxlines: task.restrictions.maxlines,
            unittype: task.unittype,
            allregex,
          }),
      } as Task;
    } else {
      return unit as Guide;
    }
  });
  return enrichedUnits;
};

const formatForbidden = ({
  forbidden,
  musthave,
  maxlines,
  unittype,
  allregex,
}: {
  forbidden: string[];
  musthave: string[];
  maxlines: number;
  unittype: string;
  allregex: allregex;
}) => {
  let res = "";
  if (unittype != TT.task) {
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

const supplyWithFilesData = async (units: UnitDB[]) => {
  const filesAndUrls = extractFileNames({ units: units });
  const filesAndFileContent = await getUnitFilesData({ filesAndUrls });
  const { unitsWithFiles } = enrichUnitWithFileLoadCode({
    units,
    filesAndFileContent,
  });
  return unitsWithFiles as GuideDBWithFiles[] | TaskDBWithFiles[];
};

const enrichUnitWithFileLoadCode = ({
  units,
  filesAndFileContent,
}: {
  units: UnitDB[];
  filesAndFileContent: FileNamesAndUrls;
}) => {
  const tasksWithFiles = units.map((unit) => ({
    ...unit,
    inout: unit.inout.map((inouttest) => {
      const filesdata = getFilesData(inouttest.inv, filesAndFileContent);
      return {
        filesdata,
        ...inouttest,
        inv: inouttest.inv,
      };
    }),
    // filedata: getFilesData(unit.inout[0].inv, filesAndFileContent).join("\n"),
  }));

  return { unitsWithFiles: tasksWithFiles };
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

const getUnitFilesData = async ({
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

const extractFileNames = ({ units }: { units: UnitDB[] }) => {
  const files: FileNamesAndUrls = {};
  units.forEach((unit) => {
    unit.inout.forEach((inout) => {
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
