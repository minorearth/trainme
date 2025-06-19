export const startListeners = () => {
  //TODO: uncomment
  document.addEventListener("copy", handleCopy);
  window.addEventListener("beforeunload", handleBeforeUnload);
  document.addEventListener("paste", handlePaste, true);
};

export const stopListeners = () => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
  document.removeEventListener("copy", handleCopy);
  document.removeEventListener("paste", handlePaste);
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
  // TODO: uncomment
  event.preventDefault();
  event.stopPropagation();
};
