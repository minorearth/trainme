"use client";
import unit from "@/components/unitrun/layers/store/unit";
import { observer } from "mobx-react-lite";

import Grid from "@mui/material/Grid2";
import TaskAndExpectedPanel from "@/components/unitrun/components/BottomPanel/task/taskTextAndExpected/TaskAndExpectedPanel";
import EditorRunInOut from "@/components/editorRunInOut/editorRunInOut";

const Task = observer(() => {
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: 3 }}
      sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}
    >
      <Grid size={{ xs: 1, md: 1 }} sx={{ flexGrow: 1, display: "flex" }}>
        <TaskAndExpectedPanel />
      </Grid>
      <Grid size={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, display: "flex" }}>
        <EditorRunInOut
          key={"Monaco_editor_task"}
          monacoid={0}
          errorHandler={unit.errorHandler}
          autolayout={false}
          showFrame={true}
        />
      </Grid>
    </Grid>
  );
});

export default Task;

// export default Task;const Task = observer(() => {
//   return (
//     <Grid
//       container
//       spacing={2}
//       columns={{ xs: 1, md: 3 }}
//       sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}
//     >
//       <Grid size={{ xs: 1, md: 1 }} sx={{ flexGrow: 1, display: "flex" }}>
//         <TaskAndExpectedPanel />
//       </Grid>
//       <Grid size={{ xs: 1, md: 2 }} sx={{ flexGrow: 1, display: "flex" }}>
//         <EditorRunInOut
//           key={"Monaco_editor_task"}
//           monacoid={0}
//           errorHandler={unit.errorHandler}
//           autolayout={false}
//           showFrame={true}
//         />
//       </Grid>
//     </Grid>
//   );
// });
