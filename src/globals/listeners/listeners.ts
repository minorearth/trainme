import S from "@/globals/settings";

export const startListeners = () => {
  if (!S.mode.allowcopy) document.addEventListener("copy", handleCopy);
  window.addEventListener("beforeunload", handleBeforeUnload);
  if (!S.mode.allowpaste) document.addEventListener("paste", handlePaste, true);
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
