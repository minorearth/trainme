import React, { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { observer } from "mobx-react-lite";
import splash from "@/components/common/splash/store";

const sec = 5 * 1000;
const speed = 5;
const CountdownCircle = observer(() => {
  const [value, setValue] = useState(sec);
  const valueRef = useRef(sec);
  useEffect(() => {
    if (!splash.shown) {
      return;
    }

    const interval = setInterval(() => {
      if (valueRef.current <= 0) {
        // countdowncircle.close();
        splash.state.onCompleteAction();
      } else
        setValue((prevState) => {
          valueRef.current = prevState - sec / speed;
          return prevState - sec / speed;
        });
    }, sec / speed);

    return () => {
      clearInterval(interval);
    };
  }, [splash.shown]);

  if (!splash.shown) return <></>;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress
          sx={{
            color: "yellow",
            "svg circle": { stroke: "url(#my_gradient)" },
          }}
          value={Number((value / sec) * 100)}
          color="inherit"
          variant="determinate"
          size="200px"
        />
      </React.Fragment>

      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,

          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{
            color: "yellow",
            fontWeight: "bold",
            textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
          }}
        >
          {`${Math.round(value / 1000)}`}
        </Typography>
      </Box>
    </Box>
  );
});

export default CountdownCircle;
