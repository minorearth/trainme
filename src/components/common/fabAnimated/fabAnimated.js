import Fab from "@mui/material/Fab";
import { motion } from "framer-motion";
import Icon2State from "./icon";
import { Tooltip } from "@mui/material";

const FabAnimated = ({ action, icon, position, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <Fab
        sx={{
          position: "absolute",
          ...position,
          boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
          background:
            "linear-gradient(135deg,rgb(18, 33, 130) 0%,rgb(255, 46, 112) 100%)",
        }}
        color="primary"
        onClick={() => action()}
      >
        <Icon2State visible={true} icon={icon} />
      </Fab>
    </Tooltip>
  );
};

export default FabAnimated;
