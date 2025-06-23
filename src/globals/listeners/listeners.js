import stn from "@/globals/settings";

export const startListeners = () => {
  if (!stn.mode.allowcopy) document.addEventListener("copy", handleCopy);
  window.addEventListener("beforeunload", handleBeforeUnload);
  if (!stn.mode.allowpaste)
    document.addEventListener("paste", handlePaste, true);
};

export const stopListeners = () => {
  if (!stn.mode.allowcopy) document.removeEventListener("copy", handleCopy);
  window.removeEventListener("beforeunload", handleBeforeUnload);
  if (!stn.mode.allowpaste) document.removeEventListener("paste", handlePaste);
};

const handleBeforeUnload = (event) => {
  const message = "Вы уверены, что хотите покинуть страницу?";
  event.preventDefault();
  event.returnValue = message;
  return message;
};

const handleCopy = (event) => {
  event.clipboardData.setData("text/plain", "No Copying!");
  event.preventDefault();
};

const handlePaste = (event) => {
  event.preventDefault();
  event.stopPropagation();
};
