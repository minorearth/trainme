"use client";
import { Panel } from "@/components/common/panel";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import CodePanel from "../editor/CodePanel";

const TaskCode = observer(() => {
  return (
    <Panel label={L.ru.TR.EDITOR} sx={{ height: "100%" }}>
      <CodePanel
        key={"Monaco_editor_task"}
        monacoid={0}
        errorHandler={unit.errorHandler}
      />
    </Panel>
  );
});

export default TaskCode;
