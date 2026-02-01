"use client";

import { observer } from "mobx-react-lite";
import TaskPanel from "./TaskPanel";

const TaskAndExpected = observer(() => {
  return <TaskPanel />;
});

export default TaskAndExpected;
