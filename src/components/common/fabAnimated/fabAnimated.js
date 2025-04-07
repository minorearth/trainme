import Fab from "@mui/material/Fab";
import { motion } from "framer-motion";
import Icon2State from "./icon";
import { Tooltip } from "@mui/material";

const FabAnimated = ({ action, icon, position, tooltip }) => {
  return (
    <Tooltip title={tooltip}>
      <Fab
        sx={{ position: "absolute", ...position }}
        color="primary"
        onClick={() => action()}
        component={motion.div}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          // times: [0, 0.2, 0.5, 0.8, 1],
          repeat: Infinity,
          repeatDelay: 0,
        }}
      >
        <Icon2State visible={true} icon={icon} />
      </Fab>
    </Tooltip>
  );
};

export default FabAnimated;
