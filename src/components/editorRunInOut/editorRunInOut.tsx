"use client";
import CodeRunPanel from "@/components/editorRunInOut/coderunPanel/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "./InoutPanel/InOutPanel";
import { useMediaQuery } from "@uidotdev/usehooks";
import {
  CODERUN_IN_OUT_TOTAL_HT_ISMOBILE,
  CODERUN_IN_OUT_TOTAL_HT,
} from "../unitrun/uiconfig";
import MonacoEd from "./monacoEd/MonacoEd";
import AnswerPanel from "./answerPanel/AnswerPanel";
import { Panel } from "../common/panel";
import unit from "@/components/unitrun/layers/store/unit";
import { L } from "@/tpconst/src";
import MonacoCommonEd from "./monacoEd/MonacoCommonEditor/MonacoCommonEd";

const EditorRunInOut = observer((props: any) => {
  const { monacoid, showFrame } = props;
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      key={`InOutRunPanel${monacoid}`}
      sx={{
        flexDirection: "column",
        display: "flex",
        flexGrow: 1,
        width: "100%",
      }}
    >
      {unit.showanswer && showFrame && (
        <Panel label={L.ru.TR.EDITOR}>
          <AnswerPanel monacoid={monacoid} />
        </Panel>
      )}

      {!unit.showanswer && showFrame && (
        <Panel label={L.ru.TR.EDITOR}>
          <MonacoCommonEd {...props} />
        </Panel>
      )}

      {!unit.showanswer && !showFrame && <MonacoCommonEd {...props} />}

      {!unit.showanswer && (
        <CodeRunPanel monacoid={monacoid} key={`codePanel${monacoid}`} />
      )}

      <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
    </Box>
  );
});

export default EditorRunInOut;
