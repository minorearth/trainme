import React, { useEffect, useState, useRef } from "react";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import Button from "@mui/material/Button";

const sec = 20 * 1000;
const speed = 100;
const CountdownButton = (props) => {
  const [isRunning, setIsRunning] = useState(true);
  const { onClick } = props;

  const [value, setValue] = useState(sec);
  const valueRef = useRef({});
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (valueRef.current <= 0) {
          setIsRunning(false);
          onClick();
        } else
          setValue((prevState) => {
            valueRef.current = prevState;
            return prevState - sec / speed;
          });
      }, sec / speed);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      // setIsRunning(false);
      // countdownbutton.hideButton();
    };
  }, [isRunning]);

  return (
    <Button id="countdownbtn" {...props}>{`Продолжить ${Math.round(
      value / 1000
    )}`}</Button>
  );
};

export default CountdownButton;
