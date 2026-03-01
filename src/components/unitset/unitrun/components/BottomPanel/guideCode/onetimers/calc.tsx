import React, { useState } from "react";
import { Panel } from "@/components/common/panel";

function ColorCalculator() {
  const [r, setR] = useState(0);
  const [g, setG] = useState(0);
  const [b, setB] = useState(0);

  const handleRChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(255, Math.max(0, Number(e.target.value)));
    setR(value);
  };

  const handleGChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(255, Math.max(0, Number(e.target.value)));
    setG(value);
  };

  const handleBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(255, Math.max(0, Number(e.target.value)));
    setB(value);
  };

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
    <Panel label={"Color Calculator"} sx={{ height: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "end",
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
              gap: "1px",
            }}
          >
            <label style={{ justifyContent: "center" }}>DEC</label>

            <input
              type="number"
              min="0"
              max="255"
              value={r}
              onChange={handleRChange}
              style={{ width: "60px", marginRight: "8px" }}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={g}
              onChange={handleGChange}
              style={{ width: "60px", marginRight: "8px" }}
            />
            <input
              type="number"
              min="0"
              max="255"
              value={b}
              onChange={handleBChange}
              style={{ width: "60px", marginRight: "8px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <label style={{ justifyContent: "center" }}>BIN</label>
            <div>{binaryR}</div>
            <div>{binaryG}</div>
            <div>{binaryB}</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <label style={{ justifyContent: "center" }}>HEX</label>
            <div>{hexR}</div>
            <div>{hexG}</div>
            <div>{hexB}</div>
          </div>
          <div style={colorStyle}></div>
        </div>
        <div>Hex: {hexCode}</div>
        <div>{`RGB: (${r}, ${g}, ${b})`}</div>
      </div>
    </Panel>
  );
}

export default ColorCalculator;
