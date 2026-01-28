import { useEffect } from "react";

export const Watcher = () => {
  //Hide python text block quotes in Monaco Editor
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.textContent?.includes("'''")
            ) {
              // const walker = document.createTreeWalker(
              //   node,
              //   NodeFilter.SHOW_TEXT,
              //   null
              // );

              // let textNode = walker.nextNode();
              // while (textNode) {
              //   if (textNode.nodeValue?.includes("'''")) {
              //     console.log(textNode);
              //     textNode.innerHTML = `<p>${textNode.innerHTML}</p> `;
              // const element = textNode.parentElement; // приведение типа
              // const parent = element.parentElement;
              // if (parent) {
              //   const parentColor =
              //     window.getComputedStyle(parent).backgroundColor;
              //   element.style.color = parentColor;
              // }
              //   }
              //   textNode = walker.nextNode();
              // }
              //confirm  as

              const element = node as Element; // приведение типа
              element.innerHTML = element.innerHTML.replace(/'''/g, "   ");
              // element.innerHTML = element.innerHTML.replace(/'''/g, "&#128280");

              // const element = node.firstChild?.firstChild as HTMLElement | null;
              // if (element) {
              //   // element.style.display = "none";
              //   const parent = element.parentElement;
              //   if (parent) {
              //     const parentColor =
              //       window.getComputedStyle(parent).backgroundColor;
              //     element.style.color = parentColor;
              //   }
              // }
            }
          });
        }
      }
    });
    // const targetNode = document.getElementById("watchmonaco");

    document.querySelectorAll(".watchmonaco").forEach((el) => {
      observer.observe(el, { childList: true, subtree: true });
    });

    // targetNode &&
    //   observer.observe(targetNode, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};
