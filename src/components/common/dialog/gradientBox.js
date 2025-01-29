import Box from "@mui/material/Box";

const GradientBox = () => {
  return (
    <Box
      sx={{
        left: "0px",
        right: "0px",
        top: "0px",
        bottom: "0px",
        backgroundColor: "red",
        position: "absolute",
        zIndex: -1,
      }}
    ></Box>
  );
};

export default GradientBox;
