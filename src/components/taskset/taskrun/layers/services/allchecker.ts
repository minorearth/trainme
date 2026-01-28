//repository
import { getAllCourseTasks } from "@/tpconst/src/RP/FB";

import { Task } from "@/tpconst/src/T";
import { D } from "@/tpconst/src/RP/FB/fbconfig.js";
import { runCheckers } from "./taskCheckHelpers";
import { supplyFilesAndTransform } from "@/components/taskset/layers/services/ETL";
import { runPythonCode } from "@/components/pyodide/pythonRunner";

export const checkAllCode = async (courseid: string) => {
  const tasks = (await supplyFilesAndTransform(
    await getAllCourseTasks(courseid),
  )) as Task[];
  await checktasks({ tasks });
};

const checktasks = async ({ tasks }: { tasks: Task[] }) => {
  tasks.forEach(async (task) => {
    if (task.rightcode) {
      const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
        await runCheckers({ code: task.rightcode, task, runPythonCode });
    }

    if (!task.forbiddencode.includes("pass")) {
      const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
        await runCheckers({ code: task.forbiddencode, task, runPythonCode });
      if (
        codeChecked == false ||
        (forbiddenChecked == true && mustHaveChecked == true)
      )
        console.log(
          codeChecked,
          mustHaveChecked,
          forbiddenChecked,
          task.taskuuid,
        );
    }
  });
};
