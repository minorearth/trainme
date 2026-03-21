"use client";
import unit from "@/components/unitrun/layers/store/unit";
import { observer } from "mobx-react-lite";
import Box from "@mui/material/Box";
import { toJS } from "mobx";
import MarkDown from "./markdown/markDown";
import EditorRunInOut from "@/components/editorRunInOut/editorRunInOut";

const Guide = observer(() => {
  return (
    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "flex",
        alignItems: "center",
        width: "100%",
        height: "auto",
      }}
    >
      {unit.editors?.map((_, id) => {
        return unit.editors[id].codepart != "" ? (
          <>
            <MarkDown text={unit.editors[id].markdown} key={`MarkDown${id}`} />
            <EditorRunInOut
              key={`EditorRunInOut${id}`}
              errorHandler={() => {}}
              monacoid={id}
              autolayout={true}
              showFrame={false}
            />
          </>
        ) : (
          <MarkDown text={unit.editors[id].markdown} key={`MarkDown${id}`} />
        );
      })}
    </Box>
  );
});

export default Guide;
