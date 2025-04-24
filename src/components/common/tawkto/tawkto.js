import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    const tawkScript = document.createElement("script");
    tawkScript.src = "https://embed.tawk.to/680a7f4529a5a61914177f20/1ipkg2alk";
    tawkScript.async = true;
    tawkScript.setAttribute("crossorigin", "*");

    document.body.appendChild(tawkScript);

    // window.Tawk_API = window.Tawk_API || {};
    // window.Tawk_API.onLoad = function () {
    //   // Устанавливаем интервал для проверки наличия поля ввода
    //   const intervalId = setInterval(() => {
    //     const inputField = document.querySelector(".tawk-chatinput-editor"); // Попробуйте найти поле ввода

    //     if (inputField) {
    //       console.log("found");
    //       inputField.firstChild.lastChild.textContent =
    //         "Ваш предзаполненный текст сообщения"; // Устанавливаем предзаполненный текст
    //       clearInterval(intervalId); // Очищаем интервал после нахождения поля ввода
    //     }
    //   }, 1000); // Проверяем каждые 1000 мс (1 секунда)
    // };

    return () => {
      document.body.removeChild(tawkScript);
    };
  }, []);

  return null;
};

export default TawkToChat;
