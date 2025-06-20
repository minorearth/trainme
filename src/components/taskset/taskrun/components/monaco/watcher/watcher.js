import { useEffect } from "react";

export const Watcher = () => {
  //Hide python text block quotes in Monaco Editor
  useEffect(() => {
    const targetNode = document.getElementById("watchmonaco");

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.textContent.includes("'''")
            ) {
              node.firstChild.firstChild.style.display = "none";
            }
          });
        }
      }
    });

    observer.observe(targetNode, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};
