"use client";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import unit from "@/components/unitrun/layers/store/unit";
import TopPG from "./components/top/TopPG";
import { useEffect } from "react";
import { TextDiffLogger } from "./components/bottom/components/log";
import EditorRunInOut from "../editorRunInOut/editorRunInOut";

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
            display: "flex",
            flexDirection: "row",
            flex: "1 1 0px",
            padding: "6px",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 0px",
              // backgroundColor: theme.palette.background.default,
              padding: "6px",
              minWidth: 0,
            }}
          >
            <TopPG />
            <EditorRunInOut
              key={"Monaco_editor_task"}
              monacoid={0}
              errorHandler={unit.errorHandler}
              autolayout={false}
              showFrame={true}
            />
          </Box>
          <TextDiffLogger />
        </Box>
      )}
    </>
  );
});

export default PG;
