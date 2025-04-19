import React, { useEffect } from "react";
import "./custom.css";

import { useTheme } from "@mui/material/styles";

export const Watcher = () => {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === "dark";

  useEffect(() => {
    const targetNode = document.body;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              node.textContent.includes("'''")
            ) {
              node.firstChild.firstChild.style.display = "none";
              // console.log(node.firstChild.firstChild.style.color);
              // isDarkMode
              //   ? (node.firstChild.firstChild.style.color = "#242323")
              //   : (node.firstChild.firstChild.style.color = "#CADCEE");
              // node.classList.add("markdown2");
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
