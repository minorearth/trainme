import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { L } from "@/tpconst/src/lang";
import S from "@/globals/settings";

const CountdownButton = ({ onClick }: { onClick: () => void }) => {
  const [isRunning, setIsRunning] = useState(true);

  const [value, setValue] = useState(S.PROCEED_SUSPENCE);
  const valueRef = useRef<number>(S.PROCEED_SUSPENCE);
  useEffect(() => {
    let interval = undefined;

    if (isRunning) {
      interval = setInterval(() => {
        if (valueRef.current <= 0) {
          setIsRunning(false);
          onClick();
        } else
          setValue((prevState) => {
            valueRef.current = prevState;
            return prevState - S.PROCEED_SUSPENCE / S.PROCEED_SPEED;
          });
      }, S.PROCEED_SUSPENCE / S.PROCEED_SPEED);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  return (
    <Button onClick={() => onClick()} variant="outlined" id="countdownbtn">{`${
      L.ru.buttons.PROCEED
    } ${Math.round(value / 1000)}`}</Button>
  );
};

export default CountdownButton;
