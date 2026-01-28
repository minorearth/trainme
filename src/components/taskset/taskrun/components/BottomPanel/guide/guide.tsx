"use client";
import { Panel } from "@/components/common/panel";
import task from "@/components/taskset/taskrun/layers/store/task";
import { monacostore } from "@/components/taskset/taskrun/layers/store/monaco";

import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import Box from "@mui/material/Box";
import { toJS } from "mobx";
import CodePanel from "../editor/CodePanel";
import { useState } from "react";
import { Guide } from "@/tpconst/src";

const GuideForm = observer(() => {
  const [stores] = useState(() => {
    const guide = task.currTask as Guide;
    return guide.parts.map(() => new monacostore());
  });

  return (
    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "auto",
      }}
    >
      {(task.currTask as Guide).parts.map((part, id) => (
        <CodePanel
          key={id}
          code={part.part}
          errorHandler={() => {}}
          inv={part.inout[0].inv}
          tasktype={task.currTask.tasktype}
          filedata={task.currTask.filedata}
          info={""}
          errorMessage={""}
          monacostore={stores[id]}
        />
      ))}
      {/* <Typography
            variant="body1"
            dangerouslySetInnerHTML={{
              __html: `<p>${task.currTask.tasktext}</p>`,
            }}
            sx={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          ></Typography> */}
    </Box>
  );
});

export default GuideForm;
