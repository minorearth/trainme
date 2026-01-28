"use client";
import { Panel } from "@/components/common/panel";
import task from "@/components/taskset/taskrun/layers/store/task";
import { monacostore } from "@/components/taskset/taskrun/layers/store/monaco";
import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import CodePanel from "../editor/CodePanel";
import { useEffect, useState } from "react";

const TaskCode = observer(() => {
  const [monacoStore] = useState(() => new monacostore());
  useEffect(() => {
    task.setMonacoStore(monacoStore);
  }, [monacoStore]);

  return (
    <Panel label={L.ru.TR.EDITOR} sx={{ height: "100%" }}>
      <CodePanel
        code={task.currTask.defaultcode}
        errorHandler={task.errorHandler}
        inv={task.currTask.inout[0].inv}
        tasktype={task.currTask.tasktype}
        filedata={task.currTask.filedata}
        info={task.info}
        errorMessage={task.errorMessage}
        monacostore={monacoStore}
      />
    </Panel>
  );
});

export default TaskCode;
