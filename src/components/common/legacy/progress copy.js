import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";

const Progress = ({ open, perc = 0 }) => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={open}
    >
      <CircularProgress color="inherit" size="80px" />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={0} sx={{ padding: "3px" }}>
          <Typography
            variant="caption"
            component="div"
            sx={{ color: "white", fontSize: 20 }}
          >
            {`${perc}%`}
          </Typography>
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default Progress;
