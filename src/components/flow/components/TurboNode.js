import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import FunctionIcon from "./FunctionIcon.js";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import CheckIcon from "@mui/icons-material/Check";
import { BiCoinStack } from "react-icons/bi";
import { GoArrowRight } from "react-icons/go";
import styled from "@emotion/styled";
import { BsUnlock } from "react-icons/bs";
import { useTheme } from "@mui/material/styles";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../../app/Monaco.ttf",
});

const Wrapper = styled.div(({ theme }) => ({
  borderRadius: "var(--node-border-radius)",
  display: "flex",
  height: "auto",
  minWidth: "150px",
  fontFamily: myFont.style.fontFamily,
  fontWeight: "500",
  letterSpacing: "-0.2px",
  boxShadow: "var(--node-box-shadow)",

  "& .body": {
    display: "flex",
    width: "250px",
  },
  "& .wrapper.gradient:before": {
    content: '""',
    background: `conic-gradient(
      from -160deg at 50% 50%,
      #e92a67 0deg,
      #a853ba 120deg,
      #2a8af6 240deg,
      #2a8af600 360deg
    )`,
    animation: "spinner 4s linear infinite",
    transform: "translate(-50%, -50%) rotate(0deg)",
    zIndex: "-1",
  },

  "& .wrapper": {
    overflow: "hidden",
    display: "flex",
    padding: "2px",
    position: "relative",
    borderRadius: "10px",
    flexGrow: 1,
  },
  "& .gradient:before": {
    content: '""',
    position: "absolute",
    paddingBottom: `calc(100% * 1.41421356237)`,
    width: `calc(100% * 1.41421356237)`,
    background: `conic-gradient(
      from -160deg at 50% 50%,
      #e92a67 0deg,
      #a853ba 120deg,
      #2a8af6 240deg,
      #e92a67 360deg
    )`,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "100%",
  },

  "& .inner": {
    background: theme.palette.background.default,
    padding: "20px 20px",
    borderRadius: "var(--node-border-radius)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    position: "relative",
    paddingBottom: "1px",
  },

  "& .title": {
    fontSize: "16px",
    width: "100%",
    marginBottom: "2px",
    lineHeight: 1.5,
    flex: 1,
  },
  "& .subline": {
    fontSize: "12px",
    color: "#777",
    marginBottom: "10px",
  },
  "& .cloud": {
    borderRadius: "100%",
    width: "30px",
    height: "30px",
    right: "0",
    position: "absolute",
    top: "0",
    transform: "translate(50%, -50%)",
    display: "flex",
    transformOrigin: "center center",
    padding: "2px",
    overflow: "hidden",
    boxShadow: "var(--node-box-shadow)",
    zIndex: 1,
  },
  "& .cost": {
    marginBottom: "0px",
    display: ["flex", "flex"],
    flexDirection: "row",
    width: "100%",
    height: "30px",
    padding: "1px",
    overflow: "hidden",
    zIndex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  "& .cost div": {
    backgroundColor: "rgba(255, 0, 0, 1)",
    flexGrow: 1,
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  "& .cloud div": {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  "& .icon": {
    marginRight: "8px",
  },
}));

const TurboNode = memo(({ data, body }) => {
  const theme = useTheme();

  return (
    <Wrapper theme={theme}>
      <div className="cloud gradient">
        <div style={{ width: "30px" }}>
          {data.completed ? (
            <CheckIcon />
          ) : data.unlocked ? (
            <LockOpenIcon />
          ) : (
            <LockIcon />
          )}
        </div>
      </div>

      <div className="wrapper gradient" onClick={() => data.action(data)}>
        <div className="inner">
          <div className="body">
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="icon">
                  <FunctionIcon />
                </div>
                <div className="title">{data.title}</div>
              </div>
              {data.subline && <div className="subline">{data.subline}</div>}
              {data.unlockpts && !data.paid && (
                <div className="cost">
                  <BiCoinStack />
                  <p>{data.unlockpts}</p>
                  <GoArrowRight />
                  <BsUnlock />
                </div>
              )}
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </Wrapper>
  );
});
TurboNode.displayName = "TurboNode";
export default TurboNode;
