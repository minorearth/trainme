import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { observer } from "mobx-react-lite";

//stores
import champ from "@/components/champ/layers/store/champ";

const RangeSlider = observer(() => {
  return (
    <Box sx={{ width: "100%", paddingLeft: "25px", paddingRight: "25px" }}>
      <Slider
        getAriaLabel={() => "Temperature range"}
        value={champ.range}
        onChange={(e: Event, newValue: number[] | number) =>
          champ.setRange(newValue as number[])
        }
        valueLabelDisplay="auto"
        min={1}
        max={30}
      />
    </Box>
  );
});

export default RangeSlider;
