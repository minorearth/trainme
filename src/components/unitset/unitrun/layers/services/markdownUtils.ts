import katex from "katex";
import { calc } from "@/components/unitset/unitrun/components/BottomPanel/guideCode/html/htmlExport";

// https://latexeditor.lagrida.com/
// https://onlinehtmleditor.dev/
export const renderFormulas = (markdown: string) => {
  let text = markdown;
  const regex = /<formula[^>]*text=(['"])(.*?)\1[^>]*>/gm;
  console.log(markdown);

  for (const match of text.matchAll(regex)) {
    const formula = match[0];
    const katexFormula = formula.match(/text='([^']*)'/) ?? "";
    const html = katex.renderToString(
      katexFormula[1].replaceAll("\\\\", "\\"),
      {
        throwOnError: false,
        displayMode: true, // или false для inline
      },
    );
    text = text.replace(formula, html);
  }
  return text;
};

export const formatMarkdown = (markdown: string) => {
  if (!markdown) {
    return "";
  }
  let markdown2 = renderFormulas(markdown);
  // markdown2 = markdown2.replace("<calc/>", calc);

  const count = (text: string, search: string) =>
    (text.match(new RegExp(search, "g")) || []).length;
  const n = count(markdown2, "'''");
  let res = markdown2;
  for (let i = 0; i < n; i++) {
    res = i % 2 == 0 ? res.replace("'''", "<p>") : res.replace("'''", "\n</p>");
  }
  return `<div class='markdown' >${res}</div>`;
};
