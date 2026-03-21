"use client";
import { Panel } from "@/components/common/panel";
import Box from "@mui/material/Box";
import unit from "@/components/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";
import CustomInput from "@/components/common/customInput/customInput";

const OutPanel = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Panel label={L.ru.TR.OUTPUTT_DATA}>
      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <CustomInput
          value={unit.editors[monacoid].output}
          onchange={() => {}}
        />
      </Box>
    </Panel>
  );
});

export default OutPanel;

// ("use client");
// import Typography from "@mui/material/Typography";
// import { Panel } from "@/components/common/panel";
// import Box from "@mui/material/Box";
// import unit from "@/components/unitrun/layers/store/unit";

// import { observer } from "mobx-react-lite";
// import { L } from "@/tpconst/src/lang";
// import { CODERUN_IN_OUT_HT } from "@/components/unitrun/uiconfig";

// const OutPanel = observer(({ monacoid }: { monacoid: number }) => {
//   return (
//     <Panel label={L.ru.TR.OUTPUTT_DATA}>
//       <Box
//         sx={{
//           display: "flex",
//           flex: "1 1 0px", // Гарантирует, что Box не выйдет за границы родителя
//           minHeight: 0,
//           minWidth: 0,
//           width: "100%", // Занимаем всю ширину Panel
//           overflow: "auto", // Включает скроллбары по необходимости (X и Y)
//         }}
//       >
//         <Typography
//           variant="body1"
//           sx={{
//             // display: "inline-block",
//             display: "block",
//             whiteSpace: "pre",
//             // whiteSpace: "pre-wrap",
//             overflow: "hidden",
//             width: "fit-content", // Позволяет Typography быть шире Box (активирует X-скролл)
//             height: "fit-content",
//           }}
//         >
//           {unit.editors[monacoid].output}
//         </Typography>
//       </Box>
//     </Panel>
//   );
// });

// export default OutPanel;
