import { motion } from "framer-motion";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const TextAnimated = ({ text }) => {
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
