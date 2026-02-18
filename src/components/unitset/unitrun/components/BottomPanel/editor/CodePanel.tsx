"use client";
import Grid from "@mui/material/Grid2";
import MonacoEd from "./monaco/MonacoEd";
import CodeRunPanel from "@/components/unitset/unitrun/components/BottomPanel/editor/edditorInout/coderunPanel";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import InOutPanel from "./edditorInout/InoutPanel/InOutPanel";
import { Typography } from "@mui/material";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { Guide, L, TT } from "@/tpconst/src";
import MarkDown from "../guideCode/markDown";
import AnswerPanel from "./AnswerPanel";
import { Panel } from "@/components/common/panel";

const formatMarkdown = (markdown: string) => {
  if (!markdown) {
    return "";
  }
  const count = (text: string, search: string) =>
    (text.match(new RegExp(search, "g")) || []).length;
  const n = count(markdown, "'''");
  let res = markdown;
  for (let i = 0; i < n; i++) {
    res =
      i % 2 == 0
        ? res.replace(
            "'''",
            "<p style='color: #444444; user-select: none; margin: 0; padding: 0; background-color:#CADCEE; display: block; width: 100%; margin-left: 20px; padding-left: 20px;  border-left: 10px; border-left-style: solid; border-color: #1977d3;' >",
          )
        : res.replace("'''", "\n</p>");
  }
  return res;
};

const CodePanel = observer((props: any) => {
  const { monacoid } = props;
  return (
    <Grid
      container
      spacing={2}
      columns={{ xs: 1, md: 2 }}
      sx={{ width: "100%", height: "100%" }}
    >
      <Grid size={{ xs: 1, md: 2 }}>
        <Box
          key={`codepanel${monacoid}`}
          sx={{
            flexDirection: "column",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {unit.currUnit.unittype == TT.task && (
            <Panel label={L.ru.TR.EDITOR} sx={{ height: "100%" }}>
              {unit.showanswer ? (
                <AnswerPanel monacoid={monacoid} />
              ) : (
                <MonacoEd {...props} monacoid={monacoid} />
              )}
            </Panel>
          )}

          {unit.currUnit.unittype == TT.guide && (
            <MarkDown text={unit.editors[monacoid].markdown} />
          )}
          {unit.currUnit.unittype == TT.guide && (
            <MonacoEd {...props} monacoid={monacoid} />
          )}

          <Box
            key={`InOutRunPanel${monacoid}`}
            sx={{
              flexDirection: "column",
              display: "flex",
              justifyContent: "flex-end",
              justifyItems: "flex-end",
              alignItems: "center",
              height: "225px",
              width: "100%",
            }}
          >
            <CodeRunPanel monacoid={monacoid} key={`codePanel${monacoid}`} />
            <InOutPanel monacoid={monacoid} key={`InOutRunPanel${monacoid}`} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
});

export default CodePanel;
