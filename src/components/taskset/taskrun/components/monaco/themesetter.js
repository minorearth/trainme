import task from "@/components/taskset/taskrun/store/task";

export const defineTheme = (monaco, darkmode) => {
  monaco.editor.defineTheme("dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        token: "identifier",
        foreground: "9CDCFE",
      },
      {
        token: "identifier.function",
        foreground: "DCDCAA",
      },
      {
        token: "type",
        foreground: "1AAFB0",
      },
    ],
    colors: {
      "editor.background": "#121212",
    },
  });
  monaco.editor.defineTheme("light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#FFFFFF",
    },
  });
  setTheme(darkmode);
};

function setTheme(darkmode) {
  if (!task.monacoRef.current) return;

  darkmode
    ? task.monacoRef?.current.editor.setTheme("dark")
    : task.monacoRef?.current.editor.setTheme("light");
}
