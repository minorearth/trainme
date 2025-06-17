"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import DashBoard from "../../components/manager/dashboard";
import Box from "@mui/material/Box";

export default function Page({ params }) {
  const { customTheme } = useCustomTheme();
  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Box
        sx={{
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <DashBoard />
      </Box>
    </ThemeProvider>
  );
}
