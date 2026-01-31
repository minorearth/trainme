"use client";
import unit from "@/components/unitset/unitrun/layers/store/unit";
import { observer } from "mobx-react-lite";
import { TT } from "@/tpconst/src/const";
import Box from "@mui/material/Box";
import { toJS } from "mobx";
import CodePanel from "../editor/CodePanel";

const GuideForm = observer(() => {
  return (
    <Box
      sx={{
        flexDirection: "column",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "auto",
      }}
    >
      {unit.editors?.map((value, id) => (
        <CodePanel key={id} errorHandler={() => {}} monacoid={id} />
      ))}
    </Box>
  );
});

export default GuideForm;
