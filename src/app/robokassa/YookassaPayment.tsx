import React, { useEffect } from "react";

interface YooMoneyCheckoutWidgetOptions {
  confirmation_token: string;
  return_url: string;
  customization?: {
    colors?: {
      control_primary?: string;
      background?: string;
    };
  };
  error_callback?: (error: unknown) => void;
}

interface YooMoneyCheckoutWidget {
  render: (elementId: string) => void | HTMLElement;
}

declare global {
  interface Window {
    YooMoneyCheckoutWidget?: new (
      options: YooMoneyCheckoutWidgetOptions
    ) => YooMoneyCheckoutWidget;
  }
}

const YookassaPayment = ({ id }: { id: string }) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://yookassa.ru/checkout-widget/v1/checkout-widget.js";
    script.async = true;

    script.onload = () => {
      if (window.YooMoneyCheckoutWidget) {
        const checkout = new window.YooMoneyCheckoutWidget({
          confirmation_token: id,
          return_url: "https://wpm-seven.vercel.app/chapters",

          // customization: {
          //   colors: {
          //     control_primary: '#00BF96',
          //     background: '#F2F3F5'
          //   }
          // },

          error_callback: (error: unknown) => {
            console.error(error);
          },
        });

        checkout.render("payment-form");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div id="payment-form"></div>

      <p>
        Данные банковской карты для оплаты в <b>тестовом магазине</b>:
      </p>
      <ul>
        <li>
          номер — <b>5555 5555 5555 4477</b>
        </li>
        <li>
          срок действия — <b>01/30</b>
        </li>
        <li>
          CVC — <b>123</b>
        </li>
        <li>
          код для прохождения 3-D Secure — <b>123</b>
        </li>
      </ul>
      {/* <a
        href="https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/testing#test-bank-card"
        target="_blank"
        rel="noopener noreferrer"
      >
        Другие тестовые банковские карты
      </a> */}
    </div>
  );
};

export default YookassaPayment;
