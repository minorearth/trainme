// const handleTouchMove = (event) => {
//   const model = editor.getModel();
//   if (!model) return;
//   const scrollTop = editor.getScrollTop();
//   const scrollHeight = editor.getScrollHeight();
//   const lastLineHeight = editor.getOption(
//     monaco.editor.EditorOption.lineHeight
//   );
//   const deltaY =
//     event.touches[0].clientY -
//     (editor.getDomNode().getBoundingClientRect().top + scrollTop);
//   if (scrollTop + deltaY >= scrollHeight - lastLineHeight) {
//     event.preventDefault();
//     window.scrollBy(0, deltaY);
//   } else {
//     event.preventDefault();
//   }
// };

// const editorElement = editor.getDomNode();
// if (editorElement) {
//   editorElement.addEventListener("touchmove", handleTouchMove, {
//     passive: false,
//   });
// }

// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchmove", (e) => touchmove(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchstart", (e) => touchstart(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchend", (e) => touchend(e));
// document
//   .querySelector("body")
//   .addEventListener("touchmove", (e) => touchmove(e));
// document
//   .querySelector("body")
//   .addEventListener("touchstart", (e) => touchstart(e));
// document
//   .querySelector("body")
//   .addEventListener("touchend", (e) => touchend(e));

// var startX, startY;

// function touchstart(e) {
//   startX = e.touches[0].clientX;
//   startY = e.touches[0].clientY;
// }

// function touchend(e) {
//   startX = 0;
//   startY = 0;
// }

// function touchmove(e) {
//   var deltaX = e.touches[0].clientX - startX,
//     deltaY = e.touches[0].clientY - startY;
//   document.querySelector("body").scrollBy(0, -deltaY / 100);
// }

// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchmove", (e) => touchmove(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchstart", (e) => touchstart(e));
// editorRef?.current
//   ?.getContainerDomNode()
//   .addEventListener("touchend", (e) => touchend(e));
// document
//   .querySelector("body")
//   .addEventListener("touchmove", (e) => touchmove(e));
// document
//   .querySelector("body")
//   .addEventListener("touchstart", (e) => touchstart(e));
// document
//   .querySelector("body")
//   .addEventListener("touchend", (e) => touchend(e));

// var startX, startY;

// function touchstart(e) {
//   startX = e.touches[0].clientX;
//   startY = e.touches[0].clientY;
// }

// function touchend(e) {
//   startX = 0;
//   startY = 0;
// }

// function touchmove(e) {
//   var deltaX = e.touches[0].clientX - startX,
//     deltaY = e.touches[0].clientY - startY;
//   document.querySelector("body").scrollBy(0, -deltaY / 100);
// }
