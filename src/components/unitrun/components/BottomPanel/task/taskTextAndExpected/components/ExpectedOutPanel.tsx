"use client";
import Typography from "@mui/material/Typography";
import { Panel } from "@/components/common/panel";
import unit from "@/components/unitrun/layers/store/unit";

import { observer } from "mobx-react-lite";
import { L } from "@/tpconst/src/lang";
import { Box } from "@mui/material";
import CustomInput from "@/components/common/customInput/customInput";
import { CODERUN_IN_OUT_HT } from "@/components/unitrun/uiconfig";

const ExpectedOutPanel = observer(() => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        // flexGrow: 1,
        height: CODERUN_IN_OUT_HT,
      }}
    >
      <Panel label={L.ru.TR.EXPECTED_OUTPUT}>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <CustomInput
            value={unit.currUnit.defaultoutput.join("\n")}
            onchange={() => {}}
          />
        </Box>
      </Panel>
    </Box>
  );
});

export default ExpectedOutPanel;

// "use client";
// import Typography from "@mui/material/Typography";
// import { Panel } from "@/components/common/panel";
// import unit from "@/components/unitrun/layers/store/unit";

// import { observer } from "mobx-react-lite";
// import { L } from "@/tpconst/src/lang";
// import { Box } from "@mui/material";

// const ExpectedOutPanel = observer(() => {
//   return (
//     <Box
//       sx={{
//         width: "100%",
//         height: "170px",
//       }}
//     >
//       <Panel label={L.ru.TR.EXPECTED_OUTPUT} sx={{ height: "100%" }}>
//         <Typography
//           variant="body1"
//           sx={{
//             display: "inline-block",
//             whiteSpace: "pre-wrap",
//             overflow: "auto",
//           }}
//         >
//           {unit.currUnit.defaultoutput.join("\n")}
//         </Typography>
//       </Panel>
//     </Box>
//   );
// });

// export default ExpectedOutPanel;
