import S from "@/globals/settings";

export const startListeners = () => {
  if (!S.mode.allowcopy) document.addEventListener("copy", handleCopy);
  window.addEventListener("beforeunload", handleBeforeUnload);
  if (!S.mode.allowpaste) document.addEventListener("paste", handlePaste, true);

  const onWheel = (e: WheelEvent) => {
    const target = e.target as HTMLElement;
    if (e.target && target.closest(".monaco-editor")) {
      e.preventDefault();
      window.scrollBy({ top: e.deltaY, left: 0, behavior: "auto" });
    }
  };

  window.addEventListener("wheel", onWheel, {
    capture: true,
    passive: false,
  });
  return () => window.removeEventListener("wheel", onWheel, { capture: true });
};

export const stopListeners = () => {
  if (!S.mode.allowcopy) document.removeEventListener("copy", handleCopy);
  window.removeEventListener("beforeunload", handleBeforeUnload);
  if (!S.mode.allowpaste) document.removeEventListener("paste", handlePaste);
};

const handleBeforeUnload = (event: Event) => {
  const message = "";
  event.preventDefault();
  // event.returnValue = message;
  return message;
};

const handleCopy = (event: ClipboardEvent) => {
  event.clipboardData?.setData("text/plain", "No Copying!");
  event.preventDefault();
};

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
};
