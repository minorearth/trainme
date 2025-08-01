import React from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const CSSLoader = () => {
  const theme = useTheme();

  return (
    <StyledWrapper theme={theme}>
      <div className="spinner">
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div(({ theme }) => ({
  ".spinner": { position: "absolute", width: "9px", height: "9px" },
  ".spinner div": {
    position: "absolute",
    width: "50%",
    height: "150%",
    backgroundColor: theme.palette.primary.light,
    transform:
      "rotate(calc(var(--rotation) * 1deg))\n      translate(0, calc(var(--translation) * 1%))",
    animation: "spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease",
  },
  ".spinner div:nth-child(1)": {
    "--delay": "0.1",
    "--rotation": "36",
    "--translation": "150",
  },
  ".spinner div:nth-child(2)": {
    "--delay": "0.2",
    "--rotation": "72",
    "--translation": "150",
  },
  ".spinner div:nth-child(3)": {
    "--delay": "0.3",
    "--rotation": "108",
    "--translation": "150",
  },
  ".spinner div:nth-child(4)": {
    "--delay": "0.4",
    "--rotation": "144",
    "--translation": "150",
  },
  ".spinner div:nth-child(5)": {
    "--delay": "0.5",
    "--rotation": "180",
    "--translation": "150",
  },
  ".spinner div:nth-child(6)": {
    "--delay": "0.6",
    "--rotation": "216",
    "--translation": "150",
  },
  ".spinner div:nth-child(7)": {
    "--delay": "0.7",
    "--rotation": "252",
    "--translation": "150",
  },
  ".spinner div:nth-child(8)": {
    "--delay": "0.8",
    "--rotation": "288",
    "--translation": "150",
  },
  ".spinner div:nth-child(9)": {
    "--delay": "0.9",
    "--rotation": "324",
    "--translation": "150",
  },
  ".spinner div:nth-child(10)": {
    "--delay": "1",
    "--rotation": "360",
    "--translation": "150",
  },
  "@keyframes spinner-fzua35": {
    "0%,\n    10%,\n    20%,\n    30%,\n    50%,\n    60%,\n    70%,\n    80%,\n    90%,\n    100%":
      {
        transform:
          "rotate(calc(var(--rotation) * 1deg))\n        translate(0, calc(var(--translation) * 1%))",
      },
    "50%": {
      transform:
        "rotate(calc(var(--rotation) * 1deg))\n        translate(0, calc(var(--translation) * 1.5%))",
    },
  },
}));

export default CSSLoader;
