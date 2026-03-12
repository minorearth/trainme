"use client";
import { observer } from "mobx-react-lite";
import { Typography } from "@mui/material";
import "./markDown.css";
import "katex/dist/katex.min.css";
import ColorCalculator from "./miniapps/calcRGB";
import ColorCalculatorRGBA from "./miniapps/calcRGBA";

import { formatMarkdown } from "@/components/unitrun/layers/services/markdownUtils";

const MarkDown = observer(({ text }: { text: string }) => {
  return (
    <>
      <Typography
        variant="body1"
        dangerouslySetInnerHTML={{
          __html: `<p>${formatMarkdown(text)}</p>`,
        }}
        sx={{
          display: "inline-block",
          whiteSpace: "pre-wrap",
          // wordWrap: "break-word",
          width: "100%",
        }}
      ></Typography>
      {text.includes("<calc/>") && <ColorCalculator />}
      {text.includes("<calcRGBA/>") && <ColorCalculatorRGBA />}
    </>
  );
});

export default MarkDown;
