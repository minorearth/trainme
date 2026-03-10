"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import DashBoard from "@/components/manager/groupsNreports/dashboard";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { startUidMonitor } from "@/tpconst/src";
import user from "@/auth/store/user";
import { logout } from "@/globals/next/session";

export default function Page({}) {
  const { customTheme } = useCustomTheme();
  useEffect(() => {
    startUidMonitor(
      (id) => user.setUserid(id),
      () => logout(),
    );
  }, []);
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
