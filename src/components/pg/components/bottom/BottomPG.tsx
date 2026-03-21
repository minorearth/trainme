"use client";
import CodeRunPanel from "@/components/editorRunInOut/coderunPanel/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "../../../editorRunInOut/InoutPanel/InOutPanel";
import unit from "@/components/unitrun/layers/store/unit";
import { L } from "@/tpconst/src";

import { Editor } from "@monaco-editor/react";
import { EditorOptions } from "../../../editorRunInOut/monacoEd/MonacoCommonEditor/MonacoEditorOptions";
import { Panel } from "../../../common/panel";
import DropZone from "./components/dropzone";

const BottomPG = observer(({ monacoid }: { monacoid: number }) => {
  return (
    <Box
      key={`codepanel${monacoid}`}
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
        width: "100%",
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
        <Box
          key={`InOutRunPanel${monacoid}`}
          sx={{
            flexDirection: "row",
            display: "flex",
            height: "170px",
            width: "100%",
            padding: "5px",
            alignItems: "flex-start",
          }}
        >
          <DropZone />
          <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
        </Box>
      </Box>
    </Box>
  );
});

export default BottomPG;
