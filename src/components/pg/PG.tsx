"use client";
import Grid from "@mui/material/Grid2";
import CodeRunPanel from "@/components/unitset/unitrun/components/BottomPanel/editor/edditorInout/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "../unitset/unitrun/components/BottomPanel/editor/edditorInout/InoutPanel/InOutPanel";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { Guide, L, TT } from "@/tpconst/src";
import usePyodide from "@/components/pyodide/usePyodide";
import { Editor } from "@monaco-editor/react";
import { EditorOptions } from "../unitset/unitrun/components/BottomPanel/editor/monaco/MonacoEditorOptions";
import FloatMenu from "../Navigator/floatMenu";
import DLSwitch from "../common/themeswitch/themeSwitch";
import { Panel } from "../common/panel";
import BottomPG from "./BottomPG";
import { useTheme } from "styled-components";
import TopPG from "./TopPG";
import { useEffect } from "react";
import { TextDiffLogger } from "./log";
import DropZone from "./dropzone";

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
