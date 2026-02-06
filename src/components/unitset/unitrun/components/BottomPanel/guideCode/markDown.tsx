"use client";
import { observer } from "mobx-react-lite";
import { Typography } from "@mui/material";

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

const MarkDown = observer(({ text }: { text: string }) => {
  return (
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
  );
});

export default MarkDown;
