"use client";
import CodeRunPanel from "@/components/unitrun/components/BottomPanel/editor/edditorInout/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "./edditorInout/InoutPanel/InOutPanel";

const CodeRunInOut = observer((props: any) => {
  const { monacoid } = props;
  return (
    <Box
      key={`InOutRunPanel${monacoid}`}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyItems: "flex-start",
        height: "225px",
        width: "100%",
      }}
    >
      <CodeRunPanel monacoid={monacoid} key={`codePanel${monacoid}`} />
      <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
    </Box>
  );
});

export default CodeRunInOut;
