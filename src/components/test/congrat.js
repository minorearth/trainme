"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CongratAnimation from "@/components/congratulation/congratAnimation";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTheme } from "@mui/material/styles";

const Congrat = ({ accomplishTest }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: window.innerHeight,
        alignItems: "center",
        justifyContent: "center",
        transition: "padding 5s",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CongratAnimation />

      <Button
        sx={{ mt: 3, mb: 3 }}
        variant="outlined"
        aria-label="repeat"
        onClick={() => accomplishTest(false)}
        endIcon={<ReplayIcon />}
      >
        {"Вернуться к курсу"}
      </Button>
    </Box>
  );
};

export default Congrat;
