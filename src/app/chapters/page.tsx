"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/auth/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import { useEffect } from "react";
import { startUidMonitor } from "../../tpconst/src/DB/FB/CA";

import { logout } from "@/globals/next/session";

const Page = observer(({}) => {
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
        {!!user.userid && <Navigator />}
      </ThemeProvider>
    </>
  );
});

export default Page;
