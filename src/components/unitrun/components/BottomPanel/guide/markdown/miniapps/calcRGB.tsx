

import React, { useState } from "react";
import { Panel } from "@/components/common/panel";
import CustomizedSlider from "@/components/common/slider/slider";
import slider from "@/components/common/slider/store";
import { observer } from "mobx-react-lite";

const ColorCalculator = observer(() => {

  const r = slider.state["r"] ?? 0;
  const g = slider.state["g"] ?? 0;
  const b = slider.state["b"] ?? 0;

  const colorStyle = {
    height: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    border: "1px solid #000",
    marginLeft: "10px",
  };

  // Функции для отображения двоичного и шестнадцатеричного
  const toBinaryString = (value: number) => value.toString(2).padStart(8, "0");
  const toHexString = (value: number) =>
    value.toString(16).padStart(2, "0").toUpperCase();
  const getColorHex = (r: number, g: number, b: number) =>
    `#${toHexString(r)}${toHexString(g)}${toHexString(b)}`;

  const hexCode = getColorHex(r, g, b);
  const binaryR = toBinaryString(r);
  const binaryG = toBinaryString(g);
  const binaryB = toBinaryString(b);
  const hexR = toHexString(r);
  const hexG = toHexString(g);
  const hexB = toHexString(b);

  return (
    <Panel label={"Color Calculator"} sx={{ height: "100%", width: "800px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            height: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "space-around",
              paddingTop: "45px",
              gap: "25px",
              height: "100%",
            }}
          >
            <label style={{ width: "40px" }}>R:</label>
            <label style={{ width: "40px" }}>G:</label>
            <label style={{ width: "40px" }}>B:</label>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "9px",
              paddingTop: "10px",
              height: "100%",
              justifyContent: "space-around",
            }}
          >
            <label style={{}}>DEC</label>
            <CustomizedSlider name="r" />
            <CustomizedSlider name="g" />
            <CustomizedSlider name="b" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
              gap: "9px",
              height: "100%",
            }}
          >
            <label style={{}}>BIN</label>
            <div>{binaryR}</div>
            <div>{binaryG}</div>
            <div>{binaryB}</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
              gap: "9px",
              height: "100%",
            }}
          >
            <label style={{ justifyContent: "center" }}>HEX</label>
            <div>{hexR}</div>
            <div>{hexG}</div>
            <div>{hexB}</div>
          </div>
          <div style={colorStyle}></div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
            gap: "9px",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              gap: "9px",
              height: "100%",
              width: "200px",
            }}
          >
            <div>Hex: {hexCode}</div>
            <div>{`RGB: (${r}, ${g}, ${b})`}</div>
          </div>
        </div>
      </div>
    </Panel>
  );
});

export default ColorCalculator;
