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
              node.textContent?.includes("'''")
            ) {
              //Property 'style' does not exist on type 'ChildNode'
              //  node.firstChild instanceof HTMLElement &&
              //   node.firstChild.firstChild instanceof HTMLElement
              // ) {
              //   node.firstChild.firstChild.style.display = "none";
              // }

              //confirm  as
              const element = node.firstChild?.firstChild as HTMLElement | null;
              if (element) {
                element.style.display = "none";
              }
            }
          });
        }
      }
    });

    targetNode &&
      observer.observe(targetNode, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
};
