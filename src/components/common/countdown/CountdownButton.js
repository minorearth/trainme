import React, { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import countdownbutton from "@/store/cowntdownbutton";
import Button from "@mui/material/Button";

const sec = 5 * 1000;
const speed = 100;
const CountdownButton = (props) => {
  const [isRunning, setIsRunning] = useState(true);

  const [value, setValue] = useState(sec);
  const valueRef = useRef({});
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (valueRef.current == 0) {
          setIsRunning(false);
          document.getElementById("countdownbtn").click();
          countdownbutton.closeDialog();
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
    };
  }, [isRunning]);

  return (
    <Button id="countdownbtn" {...props}>{`Продолжить ${Math.round(
      value / 1000
    )}`}</Button>
  );
};

export default CountdownButton;
