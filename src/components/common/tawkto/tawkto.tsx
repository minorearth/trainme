import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    const tawkScript = document.createElement("script");
    tawkScript.src = "https://embed.tawk.to/680a7f4529a5a61914177f20/1ipkg2alk";
    tawkScript.async = true;
    tawkScript.setAttribute("crossorigin", "*");

    document.body.appendChild(tawkScript);

    return () => {
      document.body.removeChild(tawkScript);
    };
  }, []);

  return null;
};

export default TawkToChat;
