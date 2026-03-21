"use client";
import { observer } from "mobx-react-lite";
import InPanel from "./Components/InPanel";
import OutPanel from "./Components/OutPanel";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Box } from "@mui/material";
import { CODERUN_IN_OUT_HT } from "@/components/unitrun/uiconfig";

const InOutPanel = observer(({ monacoid }: { monacoid: number }) => {
  const isMobile = useMediaQuery("(max-width:600px)"); // например, для мобильных

  return (
    <Box
      sx={{
        height: isMobile ? CODERUN_IN_OUT_HT * 2 : CODERUN_IN_OUT_HT,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minWidth: 0,
        gap: 2,
      }}
    >
      <InPanel monacoid={monacoid} />
      <OutPanel monacoid={monacoid} />
    </Box>
  );
});

export default InOutPanel;
