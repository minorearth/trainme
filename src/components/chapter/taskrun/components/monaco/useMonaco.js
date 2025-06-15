import { useEffect, useState } from "react";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";

const useMonaco = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!task.editorRef.current || Object.keys(task.currTask).length === 0) {
      return;
    }
    task.editorRef.current.setValue(task.currTask?.code);

    task.currTask.tasktype == "guide"
      ? task.editorRef.current.updateOptions({ lineNumbers: "off" })
      : task.editorRef.current.updateOptions({ lineNumbers: "on" });
  }, [mounted, task.currTask?.taskuuid]);

  function handleEditorDidMount({ editor, monaco, darkmode }) {
    task.setMonacoRefs(monaco, editor);
    setMounted((state) => !state);
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
    document.addEventListener(
      "paste",
      (event) => {
        // TODO: uncomment
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );

    const handleTouchMove = (event) => {
      const model = editor.getModel();
      if (!model) return;
      const scrollTop = editor.getScrollTop();
      const scrollHeight = editor.getScrollHeight();
      const lastLineHeight = editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
      const deltaY =
        event.touches[0].clientY -
        (editor.getDomNode().getBoundingClientRect().top + scrollTop);
      if (scrollTop + deltaY >= scrollHeight - lastLineHeight) {
        event.preventDefault();
        window.scrollBy(0, deltaY);
      } else {
        event.preventDefault();
      }
    };

    const editorElement = editor.getDomNode();
    if (editorElement) {
      editorElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }
  }

  function setTheme(darkmode) {
    if (!task.monacoRef.current) return;

    darkmode
      ? task.monacoRef?.current.editor.setTheme("dark")
      : task.monacoRef?.current.editor.setTheme("light");
  }

  const handleChangeContent = ({ value }) => {
    const model = task.editorRef.current.getModel();
    const lineCount = model.getLineCount();

    lineCount > task.currTask.maxlines && task.currTask.tasktype != "guide"
      ? task.updateCurrTask({
          code: value || "",
          maxlineserror: "Превышено максимальное количество строк",
        })
      : task.updateCurrTask({ code: value || "", maxlineserror: "" });
  };

  const refreshEditor = () => {
    task.editorRef.current.setValue(task.currTask.defaultcode);
  };

  return {
    handleEditorDidMount,
    handleChangeContent,
    refreshEditor,
  };
};

export default useMonaco;
