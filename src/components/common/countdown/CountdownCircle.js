import React, { useEffect, useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import countdown from "@/store/cowntdown";

const sec = 15 * 1000;
const speed = 100;
const Countdown = () => {
  const [isRunning, setIsRunning] = useState(true);

  const [value, setValue] = useState(sec);
  const valueRef = useRef({});
  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (valueRef.current == 0) {
          setIsRunning(false);
          countdown.closeDialog();
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
    // <Backdrop
    //   sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
    //   open={open}
    // >
    <Box
      sx={{
        position: "absolute",
        right: "40px",
        top: "20px",
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
          size="80px"
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
          variant="h4"
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
    // </Backdrop>
  );
};

export default Countdown;

// {
//   /* <Button
//         variant="outlined"
//         onClick={() => {
//           setIsRunning(true);
//         }}
//       >
//         Start
//       </Button> */
// }
