import Fab from "@mui/material/Fab";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const TextAnimated = ({ text, tooltip }) => {
  return (
    <Box
      // sx={{ position: "absolute", ...position }}
      color="primary"
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
      <Paper elevation={0} sx={{ padding: "3px" }}>
        <Typography variant="body1">{text}</Typography>
      </Paper>{" "}
    </Box>
  );
};

export default TextAnimated;
