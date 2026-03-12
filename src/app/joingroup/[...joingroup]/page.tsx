"use client";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import Joingroup from "@/components/manager/joinGroup/joingroup";
import { useEffect } from "react";
import { startUidMonitor } from "@/tpconst/src";
import user from "@/auth/store/user";
import { logout } from "@/globals/next/session";

interface PageProps {
  params: {
    joingroup: [groupid: string, manager: string];
  };
}
export default function Page({ params }: PageProps) {
  const { customTheme } = useCustomTheme();
  useEffect(() => {
    startUidMonitor(
      (id) => user.setUserid(id),
      () => logout(),
    );
  }, []);
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Joingroup
          groupid={params.joingroup[0]}
          manager={params.joingroup[1]}
        />
      </ThemeProvider>
    </>
  );
}
