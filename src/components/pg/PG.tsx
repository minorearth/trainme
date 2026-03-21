"use client";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import unit from "@/components/unitrun/layers/store/unit";
import BottomPG from "./components/bottom/BottomPG";
import TopPG from "./components/top/TopPG";
import { useEffect } from "react";
import { TextDiffLogger } from "./components/bottom/components/log";

const PG = observer(({ monacoid }: { monacoid: number }) => {
  useEffect(() => {
    unit.setPGState();
  }, []);

  // const theme = useTheme();
  return (
    <>
      {unit.editors.length != 0 && (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            // backgroundColor: theme.palette.background.default,
            padding: "6px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              // backgroundColor: theme.palette.background.default,
              padding: "6px",
            }}
          >
            <TopPG />
            <BottomPG monacoid={monacoid} />
          </Box>
          <TextDiffLogger />
        </Box>
      )}
    </>
  );
});

export default PG;
