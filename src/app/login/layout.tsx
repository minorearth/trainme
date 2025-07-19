"use client";
// import "@/globals/globals.css";
import * as React from "react";
import Avatar from "@mui/material/Avatar";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import L from "@/globals/local";
import background from "./background.json";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import DLSwitch from "@/components/common/themeswitch/themeSwitch";
import { useCustomTheme } from "@/app/theme";
import splash from "@/components/common/splash/store";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function Copyright({ ...other }) {
  return (
    <Typography color="text.secondary" align="center" {...other}>
      {"Copyright © "}
      <Link color="inherit" href={process.env.NEXT_PUBLIC_DOMAIN}>
        {L.ru.text.APP_NAME}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { customTheme } = useCustomTheme();

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          size={{ xs: 0, sm: 6, md: 8 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Lottie animationData={background} loop={true}></Lottie>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6, md: 4 }}
          component={Paper}
          elevation={0}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar onClick={() => {}} sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            {children}
            <Copyright sx={{ mt: 5 }} />
            <DLSwitch sx={{}} />
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default Layout;
