import React, { useState } from "react";
import { Panel } from "@/components/common/panel";
import CustomizedSlider from "@/components/common/slider/slider";
import slider from "@/components/common/slider/store";
import { observer } from "mobx-react-lite";

const ColorCalculator = observer(() => {
  const r = slider.state["r"] ?? 0;
  const g = slider.state["g"] ?? 0;
  const b = slider.state["b"] ?? 0;
  const a = slider.state["a"] ?? 0;

  const colorStyle = {
    height: "100%",
    aspectRatio: 1 / 1,
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`,
    border: "1px solid #000",
    // marginLeft: "10px",
  };
  const emojiSize = 200; // Размер эмоджи и прямоугольника в px

  const toBinaryString = (value: number) => value.toString(2).padStart(8, "0");
  const toHexString = (value: number) =>
    value.toString(16).padStart(2, "0").toUpperCase();
  const getColorHex = (r: number, g: number, b: number) =>
    `#${toHexString(r)}${toHexString(g)}${toHexString(b)}`;

  const aByte = Math.round(a * 255);
  const binaryA = toBinaryString(aByte);
  const hexA = toHexString(aByte);

  const hexCode = getColorHex(r, g, b);
  const binaryR = toBinaryString(r);
  const binaryG = toBinaryString(g);
  const binaryB = toBinaryString(b);

  return (
    <Panel label={"Color Calculator"} sx={{ height: "100%", width: "800px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Основная строка с контролами */}
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
            <label style={{ width: "40px" }}>A:</label>
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
            <label>DEC</label>
            <CustomizedSlider name="r" max={255} />
            <CustomizedSlider name="g" max={255} />
            <CustomizedSlider name="b" max={255} />
            <CustomizedSlider name="a" min={0} max={1} step={0.01} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              flexDirection: "column",
              gap: "25px",
              height: "100%",
            }}
          >
            <label>BIN</label>
            <div>{binaryR}</div>
            <div>{binaryG}</div>
            <div>{binaryB}</div>
            <div>{binaryA}</div>
          </div>

          <div
            style={{
              position: "relative",
              height: "100%",
              aspectRatio: 1 / 1,
            }}
          >
            <div
              style={{
                fontSize: `${emojiSize * 0.8}px`,
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              🌟
            </div>
            <div
              style={{
                ...colorStyle,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2, // выше
              }}
            ></div>
          </div>
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
              width: "300px",
              paddingTop: "20px",
            }}
          >
            <div>{`RGBA: (${r}, ${g}, ${b}, ${a.toFixed(2)})`}</div>
            <div>Alpha: {(a * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>
    </Panel>
  );
});

export default ColorCalculator;
