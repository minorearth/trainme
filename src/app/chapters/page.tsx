"use client";
import Navigator from "@/components/Navigator/navigator";
import user from "@/auth/store/user";
import { observer } from "mobx-react-lite";
import { ThemeProvider } from "@mui/material/styles";
import { useCustomTheme } from "@/app/theme";
import { CssBaseline } from "@mui/material";
import splash from "@/components/common/splash/store";
import { useCallback, useEffect } from "react";
import { startUidMonitor } from "@/db/FB/CA/firebaseappClient";

const Page = observer(({}) => {
  const { customTheme } = useCustomTheme();
  useEffect(() => {
    startUidMonitor((id) => user.setUserid(id));
  }, []);

  // useCallback(() => splash.showAppLoader(true), []);

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
