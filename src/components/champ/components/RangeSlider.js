import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value) {
  return `${value}°C`;
}

export default function RangeSlider({ range, changeRange }) {
  return (
    <Box sx={{ width: "100%", paddingLeft: "25px", paddingRight: "25px" }}>
      <Slider
        getAriaLabel={() => "Temperature range"}
        value={range}
        onChange={changeRange}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        min={1}
        max={30}
      />
    </Box>
  );
}
