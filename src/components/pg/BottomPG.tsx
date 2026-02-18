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
import { Background } from "@xyflow/react";

const BottomPG = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Box
      key={`codepanel${monacoid}`}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        // height: "100%",
        flex: "1",
        width: "100%",
        position: "relative",
        // margin: "10px",
        // flex: 1,
      }}
    >
      <Box
        sx={{
          flexDirection: "column",
          display: "flex",
          // justifyContent: "flex-end",
          // justifyItems: "flex-end",
          // alignItems: "center",
          flex: "1",
          width: "100%",
          // overflowY: "scroll",
          // maxHeight: "700px",
          // padding: "20px",

          // flex: 1,
        }}
      >
        <Panel label={L.ru.TR.EDITOR} sx={{ height: "100%" }}>
          <Editor
            key={`monacoid${monacoid}${unit.currUnit.unituuid}`}
            width="100%"
            height="99%"
            // theme={"dark"}
            options={{ ...EditorOptions, lineNumbers: "on" }}
            language="python"
            onChange={(value) =>
              unit.handleChangeMonacoContent(value || "", monacoid, () => {})
            }
            onMount={(editor, monaco) =>
              unit.handleEditorDidMount({
                autolayout: false,
                editor,
                monaco,
                monacoid,
                containerRef: null,
              })
            }
          />
        </Panel>
      </Box>
      <Box
        key={`InOutRunPanel${monacoid}`}
        sx={{
          flexDirection: "column",
          display: "flex",
          height: "230px",
          width: "100%",
          padding: "5px",
        }}
      >
        <CodeRunPanel monacoid={monacoid} key={`codePanel${monacoid}`} />
        <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
      </Box>
    </Box>
  );
});

export default BottomPG;
