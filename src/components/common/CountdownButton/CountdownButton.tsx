import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import { L } from "@/tpconst/src/lang";
import S from "@/globals/settings";
import IconButtonNoRipple from "../IconButtonNoRipple/IconButtonNoRipple";
import { Tooltip } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IoArrowForwardCircle } from "react-icons/io5";

import Box from "@mui/material/Box";

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
    // <Button onClick={() => onClick()} variant="outlined" id="countdownbtn">{`${
    //   L.ru.buttons.PROCEED
    // } ${Math.round(value / 1000)}`}</Button>
    <Box sx={{ position: "relative", display: "inline-block" }}>
      <IconButtonNoRipple disabled={false}>
        <Tooltip title={L.ru.TT.CODE_RUN}>
          <IoArrowForwardCircle
            style={{ fontSize: "40px" }}
            // sx={{
            //   fontSize: "40px",
            //   // marginLeft: "25px",
            //   marginRight: "15px",
            // }}
            onClick={() => onClick()}
          />
        </Tooltip>
      </IconButtonNoRipple>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "110%",
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          // backgroundColor: "#f44336", // можно поменять
          // color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          pointerEvents: "none",
        }}
      >
        {`${Math.round(value / 1000)}`}
      </Box>
    </Box>
  );
};

export default CountdownButton;
